import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { consoleSmsAdapter } from "../adapters/sms/console.js";
import { generateRefreshToken, REFRESH_TTL_MS, signAccessToken } from "../lib/jwt.js";

export const authRouter = Router();

const phoneSchema = z.string().trim().min(8).max(20).regex(/^\+?[0-9]{8,15}$/);
const requestOtpSchema = z.object({ phone: phoneSchema });
const verifyOtpSchema = z.object({ phone: phoneSchema, code: z.string().trim().regex(/^[0-9]{6}$/) });

const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false
});

authRouter.post("/auth/request-otp", otpLimiter, async (req: Request, res: Response) => {
  const parsed = requestOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid phone number" });
    return;
  }

  const phone = parsed.data.phone;
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.authChallenge.create({
    data: {
      type: "PHONE_OTP",
      destination: phone,
      codeHash,
      expiresAt,
      ipAddress: req.ip
    }
  });

  await consoleSmsAdapter.sendOtp(phone, code);

  res.json({ ok: true, expiresIn: 600 });
});

authRouter.post("/auth/verify-otp", async (req: Request, res: Response) => {
  const parsed = verifyOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid phone or code" });
    return;
  }

  const { phone, code } = parsed.data;

  const challenge = await prisma.authChallenge.findFirst({
    where: {
      type: "PHONE_OTP",
      destination: phone,
      consumedAt: null
    },
    orderBy: { createdAt: "desc" }
  });

  if (!challenge || challenge.expiresAt.getTime() < Date.now()) {
    res.status(400).json({ error: "Code expired or not requested" });
    return;
  }

  if (challenge.attempts >= 5) {
    res.status(429).json({ error: "Too many attempts" });
    return;
  }

  await prisma.authChallenge.update({
    where: { id: challenge.id },
    data: { attempts: { increment: 1 } }
  });

  const ok = await bcrypt.compare(code, challenge.codeHash);
  if (!ok) {
    res.status(400).json({ error: "Incorrect code" });
    return;
  }

  await prisma.authChallenge.update({
    where: { id: challenge.id },
    data: { consumedAt: new Date() }
  });

  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: {
      phone,
      name: "Customer",
      role: "CUSTOMER"
    }
  });

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = generateRefreshToken();
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS)
    }
  });

  setAuthCookies(res, accessToken, refreshToken);

  res.json({
    user: {
      id: user.id,
      phone: user.phone,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

authRouter.post("/auth/refresh", async (req: Request, res: Response) => {
  const refreshToken = (req as { cookies?: Record<string, string> }).cookies?.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ error: "Missing refresh token" });
    return;
  }

  const candidates = await prisma.refreshToken.findMany({
    where: { revokedAt: null, expiresAt: { gt: new Date() } },
    include: { user: true }
  });

  let matched: (typeof candidates)[number] | null = null;
  for (const candidate of candidates) {
    if (await bcrypt.compare(refreshToken, candidate.tokenHash)) {
      matched = candidate;
      break;
    }
  }

  if (!matched) {
    res.status(401).json({ error: "Invalid refresh token" });
    return;
  }

  // Rotate: revoke old, issue new.
  await prisma.refreshToken.update({
    where: { id: matched.id },
    data: { revokedAt: new Date() }
  });

  const newRefreshToken = generateRefreshToken();
  const newHash = await bcrypt.hash(newRefreshToken, 10);
  await prisma.refreshToken.create({
    data: {
      userId: matched.userId,
      tokenHash: newHash,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      replacedById: matched.id
    }
  });

  const accessToken = signAccessToken({ sub: matched.userId, role: matched.user.role });
  setAuthCookies(res, accessToken, newRefreshToken);

  res.json({ ok: true });
});

authRouter.post("/auth/logout", async (req: Request, res: Response) => {
  const refreshToken = (req as { cookies?: Record<string, string> }).cookies?.refresh_token;
  if (refreshToken) {
    const candidates = await prisma.refreshToken.findMany({
      where: { revokedAt: null }
    });
    for (const candidate of candidates) {
      if (await bcrypt.compare(refreshToken, candidate.tokenHash)) {
        await prisma.refreshToken.update({
          where: { id: candidate.id },
          data: { revokedAt: new Date() }
        });
        break;
      }
    }
  }

  clearAuthCookies(res);
  res.json({ ok: true });
});

authRouter.get("/auth/me", requireAuth, async (req: AuthedRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, phone: true, email: true, name: true, role: true }
  });
  if (!user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  res.json({ user });
});

function readAccessToken(req: { cookies?: Record<string, string>; headers: Record<string, string | string[] | undefined> }): string | null {
  const cookieToken = req.cookies?.access_token;
  if (cookieToken) return cookieToken;
  const header = req.headers.authorization;
  if (typeof header === "string" && header.startsWith("Bearer ")) return header.slice(7);
  return null;
}

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  const secure = process.env.NODE_ENV === "production";
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60 * 1000
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TTL_MS
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie("access_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/" });
}

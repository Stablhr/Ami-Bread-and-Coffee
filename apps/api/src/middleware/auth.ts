import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { verifyAccessToken } from "../lib/jwt.js";

export type AuthedRequest = Request & { user?: { id: string; role: string } };

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = readAccessToken(req);
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, deletedAt: true }
    });
    if (!user || user.deletedAt) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    req.user = { id: user.id, role: user.role };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}

function readAccessToken(req: Request): string | null {
  const cookieToken = (req as Request & { cookies?: Record<string, string> }).cookies?.access_token;
  if (cookieToken) return cookieToken;
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return null;
}

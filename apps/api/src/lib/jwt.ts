import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "change-me-access";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "change-me-refresh";

export const ACCESS_TTL = process.env.JWT_ACCESS_TTL ?? "15m";
export const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type AccessTokenPayload = {
  sub: string;
  role: string;
};

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL as jwt.SignOptions["expiresIn"] });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, ACCESS_SECRET);
  if (typeof decoded === "string" || !decoded.sub || !decoded.role) {
    throw new Error("Invalid access token");
  }
  return { sub: String(decoded.sub), role: String(decoded.role) };
}

export function generateRefreshToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

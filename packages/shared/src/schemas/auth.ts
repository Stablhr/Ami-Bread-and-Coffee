import { z } from "zod";

export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/^0/, "+63"))
  .refine((v) => /^\+639\d{9}$/.test(v), "Enter a valid Philippine mobile number");

export const requestOtpSchema = z.object({ phone: phoneSchema });

export const verifyOtpSchema = z.object({
  challengeId: z.string().uuid(),
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export const requestMagicLinkSchema = z.object({
  email: z.string().email(),
});

export const verifyMagicLinkSchema = z.object({
  token: z.string().min(20),
});

export const verifyTwoFactorSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

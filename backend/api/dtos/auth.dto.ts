import {z} from 'zod';
import {addressSchema, phMobile} from './contact.dto';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one digit')
  .regex(
    /[^A-Za-z0-9]/,
    'Password must contain at least one special character'
  );

export const registerDto = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: passwordSchema,
  username: z.string().min(1).optional(),
  // Required so the shop can contact and verify customers who order.
  phone: phMobile,
  address: addressSchema
});

/** Customer edits their name, mobile number and address. */
export const updateProfileDto = z
  .object({
    firstName: z.string().trim().min(1, 'Enter your first name').max(60),
    lastName: z.string().trim().min(1, 'Enter your last name').max(60),
    phone: phMobile,
    address: addressSchema
  })
  .strict();

export const verifyDto = z.object({
  email: z.string().email(),
  code: z.string().length(6)
});

export const resendVerificationDto = z.object({
  email: z.string().email()
});

export const loginDto = z.object({
  email: z.string().min(1),
  password: z.string().min(1)
});

export const refreshDto = z.object({
  refreshToken: z.string().min(1).optional()
});

export const forgotPasswordDto = z.object({
  email: z.string().email()
});

export const resetPasswordDto = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: passwordSchema
});

export const resendResetCodeDto = z.object({
  email: z.string().email()
});

export const changePasswordDto = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema
});

export type RegisterDto = z.infer<typeof registerDto>;
export type UpdateProfileDto = z.infer<typeof updateProfileDto>;
export type VerifyDto = z.infer<typeof verifyDto>;
export type ResendVerificationDto = z.infer<typeof resendVerificationDto>;
export type LoginDto = z.infer<typeof loginDto>;
export type RefreshDto = z.infer<typeof refreshDto>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordDto>;
export type ResendResetCodeDto = z.infer<typeof resendResetCodeDto>;
export type ResetPasswordDto = z.infer<typeof resetPasswordDto>;
import { z } from 'zod';

export const passwordValidationSchema = z
  .string({
    required_error: 'Password is required',
  })
  .min(8, 'Password must be at least 8 characters long')
  .refine((password: string) => /[A-Z]/.test(password), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine((password: string) => /[a-z]/.test(password), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine((password: string) => /\d/.test(password), {
    message: 'Password must contain at least one digit',
  })
  .refine((password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
    message: 'Password must contain at least one special character',
  });

export const emailValidationSchema = z
  .string({
    required_error: 'Email is required',
  })
  .email('Invalid email');

export const userLoggedSchema = z.object({
  authToken: z.string(),
  userId: z.number(),
});

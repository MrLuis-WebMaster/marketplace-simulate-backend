import { z } from 'zod';

import { emailValidationSchema, passwordValidationSchema } from '../auth/authSchema';

const UserCredentials = {
  email: emailValidationSchema,
  password: passwordValidationSchema,
};

export const HeadersSchema = z.object({
  Authorization: z.string(),
});

export const UserCredentialsSchema = z.object({
  ...UserCredentials,
});

export const UserCreateSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }),
  ...UserCredentials,
});

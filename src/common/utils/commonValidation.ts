import { z } from 'zod';

export const commonValidations = {
  id: z
    .string()
    .refine((data) => !isNaN(Number(data)), 'ID must be a numeric value')
    .transform(Number)
    .refine((num) => num >= 0, 'ID must be a positive number'),
  itemInteger: z
    .string()
    .refine((val) => /^[0-9]+$/.test(val), { message: 'This item must be a valid non-negative integer' })
    .optional(),
  itemFloat: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseInt(val) >= 0, {
      message: 'This item must be a valid non-negative integer',
    })
    .optional(),
};

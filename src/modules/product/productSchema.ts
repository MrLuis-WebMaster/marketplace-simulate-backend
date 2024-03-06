import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export const productSchema = z.object({
  name: z.string({
    required_error: 'name is required',
  }),
  sku: z.string({
    required_error: 'sku is required',
  }),
  quantity: z
    .number({
      required_error: 'quantity is required',
    })
    .refine((value) => value > 0, { message: 'Quantity must be greater than 0' }),
  price: z
    .number({
      required_error: 'price is required',
    })
    .refine((value) => value >= 0, { message: 'Price must be non-negative' }),
});

export const queryParametersProductSchema = z.object({
  page: commonValidations.itemInteger,
  pageSize: commonValidations.itemInteger,
  searchName: z.string().optional(),
  searchSku: z.string().optional(),
  minPrice: commonValidations.itemFloat,
  maxPrice: commonValidations.itemFloat,
});

export const userIdValidation = z.object({
  userId: commonValidations.id,
});

export const productFilterWithUserIdSchema = queryParametersProductSchema.extend({
  userId: commonValidations.id.optional(),
});

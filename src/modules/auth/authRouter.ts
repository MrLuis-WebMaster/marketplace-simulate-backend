import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

import { UserCredentialsSchema } from '../user/userSchema';
import { userLoggedSchema } from './authSchema';
import { authService } from './authService';

export const authRegistry = new OpenAPIRegistry();

export const authRouter: Router = (() => {
  const router = express.Router();

  authRegistry.registerPath({
    method: 'post',
    path: '/login',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: UserCredentialsSchema,
          },
        },
      },
    },
    responses: createApiResponse(userLoggedSchema, 'Success'),
  });

  router.post('/login', validateRequest(UserCredentialsSchema), async (req: Request, res: Response) => {
    const serviceResponse = await authService.login(req.body);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();

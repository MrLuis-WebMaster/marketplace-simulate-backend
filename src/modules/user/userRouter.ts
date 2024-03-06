import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import authenticateUser from '@/common/middleware/authenticateUser';
import { routeWithRoles } from '@/common/middleware/routeWithRoles';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';
import { UserRole } from '@/database/entity/user.entity';
import { userService } from '@/modules/user/userService';

import { HeadersSchema, UserCreateSchema } from './userSchema';

export const userRegistry = new OpenAPIRegistry();

export const userRouter: Router = (() => {
  const router = express.Router();

  userRegistry.registerPath({
    method: 'post',
    path: '/seller-register',
    tags: ['User'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: UserCreateSchema,
          },
        },
      },
    },
    responses: {
      [StatusCodes.CREATED]: {
        description: 'Return true',
      },
    },
  });

  router.post('/seller-register', validateRequest(UserCreateSchema), async (req: Request, res: Response) => {
    const serviceResponse = await userService.createSeller(req.body);
    handleServiceResponse(serviceResponse, res);
  });

  //private route

  router.use(authenticateUser);

  userRegistry.registerPath({
    method: 'get',
    path: '/sellers-users',
    tags: ['User'],
    request: {
      headers: HeadersSchema,
    },
    responses: {
      [StatusCodes.OK]: {
        description: 'Return a list of seller users.',
      },
    },
  });

  router.get('/sellers-users', routeWithRoles([UserRole.ADMIN]), async (req: Request, res: Response) => {
    const serviceResponse = await userService.getSellersByAdmin();
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();

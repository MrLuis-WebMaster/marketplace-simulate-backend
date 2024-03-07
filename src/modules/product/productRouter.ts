import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import authenticateUser from '@/common/middleware/authenticateUser';
import { routeWithRoles } from '@/common/middleware/routeWithRoles';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';
import { UserRole } from '@/database/entity/user.entity';

import { productFilterWithUserIdSchema, productSchema, queryParametersProductSchema } from './productSchema';
import { productService } from './productService';

export const productRegistry = new OpenAPIRegistry();

export const productRouter: Router = (() => {
  const router = express.Router();
  productRegistry.registerPath({
    method: 'get',
    path: '/customers',
    tags: ['Product'],
    request: {
      query: queryParametersProductSchema,
    },
    responses: createApiResponse(queryParametersProductSchema, 'Success'),
  });
  router.get('/customers', validateRequest(queryParametersProductSchema), async (req: Request, res: Response) => {
    const { page, pageSize, searchName, searchSku, minPrice, maxPrice } = req.query;

    const filterOptions = {
      searchName: searchName?.toString(),
      searchSku: searchSku?.toString(),
      minPrice: minPrice ? parseFloat(minPrice.toString()) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice.toString()) : undefined,
    };
    const paginationOptions = {
      page: page ? parseInt(page.toString(), 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize.toString(), 10) : undefined,
    };
    const serviceResponse = await productService.getAllProducts(filterOptions, paginationOptions);
    handleServiceResponse(serviceResponse, res);
  });

  //private route
  router.use(authenticateUser);
  productRegistry.registerPath({
    method: 'post',
    path: '/create',
    tags: ['Product'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: productSchema,
          },
        },
      },
    },
    responses: {
      [StatusCodes.OK]: {
        description: 'Return a boolean',
      },
    },
  });

  router.post('/create', routeWithRoles(), validateRequest(productSchema), async (req: Request, res: Response) => {
    const serviceResponse = await productService.createProduct(req.body, req?.user?.id);
    handleServiceResponse(serviceResponse, res);
  });

  productRegistry.registerPath({
    method: 'get',
    path: '/',
    tags: ['Product'],
    request: {
      query: productFilterWithUserIdSchema,
    },
    responses: createApiResponse(productSchema, 'Success'),
  });

  router.get(
    '/',
    routeWithRoles(),
    validateRequest(productFilterWithUserIdSchema),
    async (req: Request, res: Response) => {
      const userId = (
        req?.user?.role === UserRole.ADMIN
          ? Number(req.query.userId) === 0 || !req.query.userId
            ? null
            : req.query.userId
          : req?.user?.id
      ) as string;

      const { page, pageSize, searchName, searchSku, minPrice, maxPrice } = req.query;
      const filterOptions = {
        searchName: searchName?.toString(),
        searchSku: searchSku?.toString(),
        minPrice: minPrice ? parseFloat(minPrice.toString()) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice.toString()) : undefined,
      };
      const paginationOptions = {
        page: page ? parseInt(page.toString(), 10) : undefined,
        pageSize: pageSize ? parseInt(pageSize.toString(), 10) : undefined,
      };

      const serviceResponse = await productService.getAllProductsByUser(
        req?.user?.role,
        userId,
        filterOptions,
        paginationOptions
      );
      handleServiceResponse(serviceResponse, res);
    }
  );

  return router;
})();

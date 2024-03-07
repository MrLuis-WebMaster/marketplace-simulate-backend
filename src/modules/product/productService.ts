import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { ProductEntity } from '@/database/entity/product.entity';
import { UserRole } from '@/database/entity/user.entity';
import { logger } from '@/server';

import { PaginationOptions, ProductFilter, ProductResponse } from './productInterface';
import { productRepository } from './productRepository';

export const productService = {
  createProduct: async (
    data: {
      name: string;
      sku: string;
      quantity: number;
      price: number;
    },
    userId: number
  ) => {
    try {
      const productCreated = await productRepository.createProduct({
        ...data,
        userId,
      });
      return new ServiceResponse<boolean | null>(
        ResponseStatus.Success,
        'Product Created',
        productCreated,
        StatusCodes.CREATED
      );
    } catch (ex) {
      const errorMessage = `Error creating product: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  getAllProductsByUser: async (
    role: string,
    userId?: number | null | string,
    filterOptions: ProductFilter = {},
    paginationOptions: PaginationOptions = {}
  ) => {
    try {
      if (role === UserRole.SELLER) {
        const products = await productRepository.getAllProductsByUser(userId, filterOptions, paginationOptions);
        return new ServiceResponse<ProductResponse | null>(
          ResponseStatus.Success,
          'List Products',
          products,
          StatusCodes.OK
        );
      }
      if (role === UserRole.ADMIN) {
        const products = await productRepository.getAllProductsByUser(
          userId || undefined,
          filterOptions,
          paginationOptions
        );
        return new ServiceResponse<ProductResponse | null>(
          ResponseStatus.Success,
          'List Products',
          products,
          StatusCodes.OK
        );
      }
      return new ServiceResponse<ProductEntity[] | null>(
        ResponseStatus.Failed,
        'List Products',
        [],
        StatusCodes.BAD_REQUEST
      );
    } catch (ex) {
      const errorMessage = `Error creating product: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  getAllProducts: async (filterOptions: ProductFilter = {}, paginationOptions: PaginationOptions = {}) => {
    try {
      const products = await productRepository.getAllProducts(filterOptions, paginationOptions);
      return new ServiceResponse<ProductResponse | null>(
        ResponseStatus.Success,
        'List Products',
        products,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating product: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};

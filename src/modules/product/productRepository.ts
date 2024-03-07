import { FindAndCountOptions, Op } from 'sequelize';

import { ProductEntity } from '@/database/entity/product.entity';
import { UserEntity } from '@/database/entity/user.entity';

import { userRepository } from '../user/userRepository';
import { PaginationOptions, ProductFilter, ProductResponse } from './productInterface';

const userIncludeAttributes = ['name', 'email'];
const productExcludeAttributes = ['createdAt', 'updatedAt'];

async function applyUserFilter(userId: number | string, queryOptions: FindAndCountOptions<any>): Promise<void> {
  const user = await userRepository.getUserById(Number(userId));
  if (!user) {
    throw new Error('User not found');
  }
  queryOptions.include = {
    model: UserEntity,
    attributes: userIncludeAttributes,
  };
  queryOptions.where = { userId };
}

async function applyProductFilters(
  filterOptions: ProductFilter,
  queryOptions: FindAndCountOptions<any>
): Promise<void> {
  if (filterOptions.searchName) {
    queryOptions.where = {
      ...queryOptions.where,
      name: { [Op.iLike]: `%${filterOptions.searchName}%` },
    };
  }

  if (filterOptions.searchSku) {
    queryOptions.where = {
      ...queryOptions.where,
      sku: { [Op.iLike]: `%${filterOptions.searchSku}%` },
    };
  }

  if (filterOptions.minPrice || filterOptions.maxPrice) {
    queryOptions.where = {
      ...queryOptions.where,
      price: {
        ...(filterOptions.minPrice && { [Op.gte]: filterOptions.minPrice }),
        ...(filterOptions.maxPrice && { [Op.lte]: filterOptions.maxPrice }),
      },
    };
  }
}

export const productRepository = {
  createProduct: async ({
    name,
    sku,
    quantity,
    price,
    userId,
  }: {
    name: string;
    sku: string;
    quantity: number;
    price: number;
    userId: number;
  }): Promise<boolean | null> => {
    try {
      const user = await userRepository.getUserById(userId);
      if (!user) {
        console.error('User not found');
        return null;
      }
      await ProductEntity.create({
        name,
        sku,
        quantity,
        price,
        userId,
      });
      return true;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  },
  getAllProductsByUser: async (
    userId?: number | null | string,
    filterOptions: ProductFilter = {},
    paginationOptions: PaginationOptions = {}
  ): Promise<ProductResponse | null> => {
    try {
      const { page = 1, pageSize = 10 } = paginationOptions;

      const queryOptions: FindAndCountOptions<any> = {
        attributes: { exclude: productExcludeAttributes },
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };

      if (!userId) {
        queryOptions.include = {
          model: UserEntity,
          attributes: userIncludeAttributes,
        };
      }

      if (userId) {
        await applyUserFilter(userId, queryOptions);
      }

      await applyProductFilters(filterOptions, queryOptions);

      const { count, rows: products } = await ProductEntity.findAndCountAll(queryOptions);

      const totalPages = Math.ceil(count / pageSize);
      const hasNextPage = page * pageSize < count;
      const hasPrevPage = page > 1;

      return {
        products,
        meta: {
          page,
          pageSize,
          totalItems: count,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      };
    } catch (error) {
      console.error('Error getting products:', error);
      return null;
    }
  },
  getAllProducts: async (
    filterOptions: ProductFilter = {},
    paginationOptions: PaginationOptions = {}
  ): Promise<ProductResponse | null> => {
    try {
      const { page = 1, pageSize = 10 } = paginationOptions;

      const queryOptions: FindAndCountOptions<any> = {
        attributes: { exclude: productExcludeAttributes },
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };

      await applyProductFilters(filterOptions, queryOptions);

      const { count, rows: products } = await ProductEntity.findAndCountAll(queryOptions);

      const totalPages = Math.ceil(count / pageSize);
      const hasNextPage = page * pageSize < count;
      const hasPrevPage = page > 1;

      return {
        products,
        meta: {
          page,
          pageSize,
          totalItems: count,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      };
    } catch (error) {
      console.error('Error getting products:', error);
      return null;
    }
  },
};

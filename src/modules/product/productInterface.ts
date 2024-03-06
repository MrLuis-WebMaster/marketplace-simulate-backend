import { ProductEntity } from '@/database/entity/product.entity';

export interface ProductFilter {
  searchName?: string;
  searchSku?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface ProductResponse {
  products: ProductEntity[];
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

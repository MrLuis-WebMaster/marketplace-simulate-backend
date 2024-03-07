import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { UserEntity, UserRole } from '@/database/entity/user.entity';
import { userRepository } from '@/modules/user/userRepository';
import { logger } from '@/server';

export const userService = {
  createSeller: async (data: { name: string; password: string; email: string }) => {
    try {
      const user = await userRepository.getUserByEmail(data.email);
      if (user) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'The user already exists in the system',
          null,
          StatusCodes.CONFLICT
        );
      }
      const isUserSellerCreated = await userRepository.createUserSeller({
        ...data,
        role: UserRole.SELLER,
      });
      if (!isUserSellerCreated) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Unable to create seller user',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      return new ServiceResponse<boolean>(
        ResponseStatus.Success,
        'Seller user created',
        isUserSellerCreated,
        StatusCodes.CREATED
      );
    } catch (ex) {
      const errorMessage = `Error creating seller user: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  createCustomer: async (data: { name: string; password: string; email: string }) => {
    try {
      const user = await userRepository.getUserByEmail(data.email);
      if (user) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'The user already exists in the system',
          null,
          StatusCodes.CONFLICT
        );
      }
      const isUserSellerCreated = await userRepository.createUserSeller({
        ...data,
        role: UserRole.CUSTOMER,
      });
      if (!isUserSellerCreated) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Unable to create customer user',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      return new ServiceResponse<boolean>(
        ResponseStatus.Success,
        'Customer user created',
        isUserSellerCreated,
        StatusCodes.CREATED
      );
    } catch (ex) {
      const errorMessage = `Error creating seller user: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  getSellersByAdmin: async () => {
    try {
      const users = await userRepository.getAllSellers();
      return new ServiceResponse<UserEntity[] | null>(ResponseStatus.Success, 'Got list', users, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error creating seller user: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};

import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { comparePassword, generateAuthToken } from '@/common/utils/auth';
import { userRepository } from '@/modules/user/userRepository';
import { logger } from '@/server';

export const authService = {
  login: async (data: { password: string; email: string }) => {
    try {
      const { password, email } = data;

      const user = await userRepository.getUserByEmail(email);

      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }

      const passwordMatch = await comparePassword(password, user.password);

      if (!passwordMatch) {
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid password', null, StatusCodes.UNAUTHORIZED);
      }

      const authToken = generateAuthToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

      return new ServiceResponse(
        ResponseStatus.Success,
        'Login successful',
        { authToken, userId: user.id },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error login: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};

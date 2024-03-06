import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { UserRole } from '@/database/entity/user.entity';

import { ResponseStatus, ServiceResponse } from '../models/serviceResponse';

export const routeWithRoles = (allowedRoles?: UserRole[]): RequestHandler => {
  const rolesToCheck = allowedRoles || [UserRole.CUSTOMER];
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Access forbidden. Insufficient permissions.',
        null,
        StatusCodes.FORBIDDEN
      );
    }

    if (!allowedRoles?.length && userRole !== UserRole.CUSTOMER) {
      return next();
    }
    if (rolesToCheck.includes(userRole) && allowedRoles?.length) {
      return next();
    }
    return new ServiceResponse(
      ResponseStatus.Failed,
      'Access forbidden. Insufficient permissions.',
      null,
      StatusCodes.FORBIDDEN
    );
  };
};

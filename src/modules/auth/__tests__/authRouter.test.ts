import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { authService } from '@/modules/auth/authService';
import { app } from '@/server';

describe('authService', () => {
  describe('login', () => {
    it('should successfully log in with valid credentials', async () => {
      vi.spyOn(authService, 'login').mockResolvedValue({
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Login successful',
        data: {
          authToken: 'token',
          userId: 1,
        },
      });

      const userCredentials = {
        email: 'test@testnoexist.com',
        password: '123456789Mm.',
      };

      const response = await request(app).post('/auth/login').send(userCredentials);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body.success).toBeTruthy();

      vi.restoreAllMocks();
    });

    it('should return an error for invalid credentials', async () => {
      vi.spyOn(authService, 'login').mockResolvedValue({
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: 'Invalid credentials',
        data: null,
      });

      const userCredentials = {
        email: 'test@test.com',
        password: 'Lgmu2750,',
      };

      const response = await request(app).post('/auth/login').send(userCredentials);

      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
      expect(response.body.success).toBeFalsy();
      vi.restoreAllMocks();
    });
  });
});

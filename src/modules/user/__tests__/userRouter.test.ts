import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { generateAuthToken } from '@/common/utils/auth';
import { app } from '@/server';

describe('User API Endpoints', () => {
  describe('GET /sellers-users', () => {
    it('should return a list of sellers', async () => {
      const token = generateAuthToken({
        id: 2,
        name: 'Test',
        email: 'test@test.com',
        role: 'ADMIN',
      });

      const response = await request(app).get('/users/sellers-users').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body.success).toBeTruthy();

      vi.restoreAllMocks();
    });
  });
});

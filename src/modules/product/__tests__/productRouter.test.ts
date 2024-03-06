import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { app } from '@/server';

describe('Product Service', () => {
  it('GET /customers should return a list of products', async () => {
    const response = await request(app).get('/product/customers');
    expect(response.status).toEqual(StatusCodes.OK);
  });
});

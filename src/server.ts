import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { openAPIRouter } from '@/api-docs/openAPIRouter';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';
import { healthCheckRouter } from '@/modules/healthCheck/healthCheckRouter';
import { userRouter } from '@/modules/user/userRouter';

import { authRouter } from './modules/auth/authRouter';
import { productRouter } from './modules/product/productRouter';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
// app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(cors());
app.use(helmet());
app.use(rateLimiter);
app.use(express.json());

// Request logging
app.use(requestLogger());

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/product', productRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import errorMiddleware from './middlewares/error.middleware';

// ─── Route imports ───
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import requestRoutes from './modules/requests/request.routes';

const app = express();

// ─── Security ───
app.use(helmet());

// ─── CORS ───
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body parsing ───
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Cookies ───
app.use(cookieParser());

// ─── Logging ───
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Custom Response Logger Middleware ───
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    if (res.statusCode >= 400) {
      console.error(`[ERROR] ${req.method} ${req.url} >> Status: ${res.statusCode} >> Body:`, body);
    } else {
      console.log(`[SUCCESS] ${req.method} ${req.url} >> Status: ${res.statusCode}`);
    }
    return originalSend.apply(res, [body]);
  };
  next();
});

// ─── Swagger Documentation ───
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Health check ───
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'ByU Connect API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);

// ─── 404 handler ───
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ─── Global error handler (MUST be last) ───
app.use(errorMiddleware);

export default app;

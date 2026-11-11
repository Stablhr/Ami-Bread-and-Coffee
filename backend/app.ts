import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import {env} from './api/config/env';
import routes from './api/routes/index';
import {errorHandler} from './api/middleware/errorHandler';
import {sanitize} from './api/middleware/sanitize';
import {requestLogger} from './api/middleware/requestLogger';
import {csrfProtection} from './api/middleware/csrf';
import {httpsRedirect} from './api/middleware/httpsRedirect';

const app = express();

const DEFAULT_ORIGINS = ['http://localhost:3000'];

function resolveAllowedOrigins(rawValue: string | undefined): string[] {
  const origins = (rawValue ?? '')
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter((o) => o.length > 0);

  if (origins.length === 0) {
    if (env.NODE_ENV === 'production') {
      console.error(
        '[cors] CORS_ORIGINS is not set. Falling back to localhost, so every ' +
          'browser request from your deployed frontend will be blocked. ' +
          'Set CORS_ORIGINS to your frontend origin, e.g. "https://app.vercel.app".'
      );
    }
    return DEFAULT_ORIGINS;
  }

  if (origins.includes('*')) {
    console.error(
      '[cors] CORS_ORIGINS contains "*". Wildcard origins are incompatible ' +
        'with credentials:true and will break authentication. List explicit origins instead.'
    );
  }

  return origins;
}

const allowedOrigins = resolveAllowedOrigins(env.CORS_ORIGINS);

const DEV_LOCALHOST_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;

function isAllowedOrigin(origin: string): boolean {
  if (allowedOrigins.includes(origin)) return true;
  // In development the Next.js dev server may fall back to another port
  // (3001, 3002, ...) when 3000 is busy. Accept any loopback origin so
  // login/CORS keeps working; production stays strictly allowlisted.
  return env.NODE_ENV !== 'production' && DEV_LOCALHOST_ORIGIN.test(origin);
}

app.use(helmet());
app.use(httpsRedirect);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'x-csrf-token']
  })
);

app.use(express.json({limit: '10kb'}));
app.use(cookieParser());
app.use(sanitize);
app.use(requestLogger);
app.use(csrfProtection);

app.use('/api', routes);

app.get('/', async (_req, res) => {
  res.send('test production!');
});

app.use(errorHandler);

export default app;

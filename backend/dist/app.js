"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./api/config/env");
const index_1 = __importDefault(require("./api/routes/index"));
const errorHandler_1 = require("./api/middleware/errorHandler");
const sanitize_1 = require("./api/middleware/sanitize");
const requestLogger_1 = require("./api/middleware/requestLogger");
const csrf_1 = require("./api/middleware/csrf");
const httpsRedirect_1 = require("./api/middleware/httpsRedirect");
const app = (0, express_1.default)();
const DEFAULT_ORIGINS = ['http://localhost:3000'];
function resolveAllowedOrigins(rawValue) {
    const origins = (rawValue ?? '')
        .split(',')
        .map((o) => o.trim().replace(/\/+$/, ''))
        .filter((o) => o.length > 0);
    if (origins.length === 0) {
        if (env_1.env.NODE_ENV === 'production') {
            console.error('[cors] CORS_ORIGINS is not set. Falling back to localhost, so every ' +
                'browser request from your deployed frontend will be blocked. ' +
                'Set CORS_ORIGINS to your frontend origin, e.g. "https://app.vercel.app".');
        }
        return DEFAULT_ORIGINS;
    }
    if (origins.includes('*')) {
        console.error('[cors] CORS_ORIGINS contains "*". Wildcard origins are incompatible ' +
            'with credentials:true and will break authentication. List explicit origins instead.');
    }
    return origins;
}
const allowedOrigins = resolveAllowedOrigins(env_1.env.CORS_ORIGINS);
const DEV_LOCALHOST_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;
function isAllowedOrigin(origin) {
    if (allowedOrigins.includes(origin))
        return true;
    // In development the Next.js dev server may fall back to another port
    // (3001, 3002, ...) when 3000 is busy. Accept any loopback origin so
    // login/CORS keeps working; production stays strictly allowlisted.
    return env_1.env.NODE_ENV !== 'production' && DEV_LOCALHOST_ORIGIN.test(origin);
}
app.use((0, helmet_1.default)());
app.use(httpsRedirect_1.httpsRedirect);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || isAllowedOrigin(origin))
            return callback(null, true);
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'x-csrf-token']
}));
app.use(express_1.default.json({ limit: '10kb' }));
app.use((0, cookie_parser_1.default)());
app.use(sanitize_1.sanitize);
app.use(requestLogger_1.requestLogger);
app.use(csrf_1.csrfProtection);
app.use('/api', index_1.default);
app.get('/', async (_req, res) => {
    res.send('test production!');
});
app.use(errorHandler_1.errorHandler);
exports.default = app;

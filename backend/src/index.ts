import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import contractsRouter from './routes/contracts';

const app = express();

const PORT = parseInt(process.env.PORT ?? '3001', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

// Middleware
app.use(cors({ origin: CORS_ORIGIN }));
// Allow 100,000 characters even when UTF-8 or JSON escaping uses more bytes.
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/contracts', contractsRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler — catches DB errors and other uncaught route errors
app.use((err: Error & { type?: string }, _req: Request, res: Response, _next: NextFunction) => {
  if (err.type === 'entity.too.large') {
    res.status(413).json({ error: 'Request body is too large' });
    return;
  }
  if (err.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Agreement Hub backend running on http://localhost:${PORT}`);
});

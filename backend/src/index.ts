import express, { Express } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { testConnection, initializeDatabase } from './config/database';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api', taskRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

async function startServer() {
  try {
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Failed to connect to database');
    }

    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
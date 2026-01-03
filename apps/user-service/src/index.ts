import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './app/data-source';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({
    service: 'user-service',
    status: 'UP',
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 4002;

AppDataSource.initialize()
  .then(() => {
    console.log('✅ User-service database connected');

    app.listen(PORT, () => {
      console.log(`🚀 User Service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to connect database', error);
    process.exit(1);
  });

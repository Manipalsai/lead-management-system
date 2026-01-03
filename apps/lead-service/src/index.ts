import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import leadRoutes from './routes/lead.routes';
import stageRoutes from './routes/stage.routes';
import { AppDataSource } from './app/data-source';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/leads', leadRoutes);
app.use('/stages', stageRoutes);
app.use('/leads', leadRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({
    service: 'lead-service',
    status: 'UP'
  });
});

const PORT = process.env.PORT || 4003;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');

    app.listen(PORT, () => {
      console.log(`Lead Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed', err);
  });

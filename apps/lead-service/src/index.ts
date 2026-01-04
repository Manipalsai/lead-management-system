import 'reflect-metadata';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';

import leadRoutes from './routes/lead.routes';
import stageRoutes from './routes/stage.routes';
import { AppDataSource } from './config/data-source';

dotenv.config();

const app = express();

/* ──────────────── MIDDLEWARE ──────────────── */
app.use(cors());
app.use(express.json());

/* ──────────────── ROUTES ──────────────── */
app.use('/leads', leadRoutes);
app.use('/stages', stageRoutes);

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    service: 'lead-service',
    status: 'UP',
  });
});

/* ──────────────── SERVER ──────────────── */
const PORT = process.env.PORT || 4003;

AppDataSource.initialize()
  .then(async () => {
    console.log('Database connected');

    // SEED STAGES
    const { LeadStage } = await import('./entities/lead-stage.entity');
    const repo = AppDataSource.getRepository(LeadStage);
    const count = await repo.count();

    if (count === 0) {
      const stages = [
        'Lead Generation',
        'Lead Capture',
        'Lead Tracking',
        'Lead Qualification',
        'Lead Distribution',
        'Lead Nurturing',
        'Lead Conversion'
      ];

      console.log('Seeding Lead Stages...');
      for (const name of stages) {
        await repo.save(repo.create({ name }));
      }
      console.log('Seeding complete.');
    }

    app.listen(PORT, () => {
      console.log(`Lead Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed', err);
  });

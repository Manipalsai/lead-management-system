import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './app/data-source';
import userRoutes from './routes/user.routes';
// @ts-ignore
import * as bcrypt from 'bcrypt';

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
  .then(async () => {
    console.log('✅ User-service database connected');

    // SEED DEFAULT USER
    const { User } = await import('./entities/user.entity');
    const userRepo = AppDataSource.getRepository(User);

    const count = await userRepo.count();
    if (count === 0) {
      console.log('Seeding default admin user...');
      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      const admin = userRepo.create({
        name: 'Super Admin',
        email: 'superadmin@lms.dev',
        password: hashedPassword,
        role: 'SUPER_ADMIN'
      });

      await userRepo.save(admin);
      console.log('Default user created: superadmin@lms.dev / Admin@123');
    }

    app.listen(PORT, () => {
      console.log(`🚀 User Service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to connect database', error);
    process.exit(1);
  });

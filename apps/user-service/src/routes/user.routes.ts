import { Router } from 'express';
import { AppDataSource } from '../app/data-source';
import { User } from '../entities/user.entity';

const router = Router();

/**
 * GET user by email (used by auth-service)
 */
router.get('/by-email/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

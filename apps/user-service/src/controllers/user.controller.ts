import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { UserService } from '../services/user.service';

export class UserController {
  static createUser(req: AuthRequest, res: Response) {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({
        message: 'Email and role are required'
      });
    }

    try {
      const user = UserService.createUser(
        req.user!.role,
        { email, role }
      );

      return res.status(201).json(user);
    } catch {
      return res.status(403).json({
        message: 'You are not allowed to create this user'
      });
    }
  }
}

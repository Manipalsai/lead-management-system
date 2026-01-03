import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AuthController {
  static async login(req: AuthRequest, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    try {
      const result = await AuthService.login(email, password);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }
  }

  /**
   * Protected route
   * Returns authenticated user info
   */
  static async me(req: AuthRequest, res: Response) {
    return res.status(200).json({
      user: req.user
    });
  }
}

import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
}

export class AuthService {
  static async login(email: string, password: string) {
    try {
      // 👇 USE 127.0.0.1 INSTEAD OF localhost
      const response = await axios.get<User>(
        `http://127.0.0.1:4002/users/by-email/${email}`
      );

      const user = response.data;

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('PASSWORD_MISMATCH');
      }

      const token = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      // 👇 TEMP LOG (IMPORTANT)
      console.error('LOGIN ERROR:', error);
      throw new Error('INVALID_CREDENTIALS');
    }
  }
}

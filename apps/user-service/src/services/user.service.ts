type Role = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

interface CreateUserPayload {
  email: string;
  role: Role;
}

export class UserService {
  static createUser(
    creatorRole: Role,
    payload: CreateUserPayload
  ) {
    if (creatorRole === 'USER') {
      throw new Error('FORBIDDEN');
    }

    if (creatorRole === 'ADMIN' && payload.role !== 'USER') {
      throw new Error('FORBIDDEN');
    }

    // TEMP response (DB will be added later)
    return {
      id: Date.now().toString(),
      email: payload.email,
      role: payload.role
    };
  }
}

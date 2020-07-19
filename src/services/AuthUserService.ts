import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import User from '../models/User';

interface AuthRequest {
  email: string;
  password: string;
}

class AuthUserService {
  public async execute({
    email,
    password,
  }: AuthRequest): Promise<{ user: User }> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('invalid email');
    }

    const checkPassword = await compare(password, user.password);

    if (!checkPassword) {
      throw new Error('invalid password');
    }

    return { user };
  }
}

export default AuthUserService;

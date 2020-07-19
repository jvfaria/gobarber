import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../config/authconfig';

interface AuthRequest {
  email: string;
  password: string;
}

class AuthUserService {
  public async execute({
    email,
    password,
  }: AuthRequest): Promise<{ user: User; token: string }> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('invalid email');
    }

    const checkPassword = await compare(password, user.password);

    if (!checkPassword) {
      throw new Error('invalid password');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthUserService;

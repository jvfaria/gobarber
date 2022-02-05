import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import authConfig from '../../../config/authconfig';

interface IAuthRequest {
  email: string;
  password: string;
}

class AuthUserService {
  public async execute({
    email,
    password,
  }: IAuthRequest): Promise<{ user: User; token: string }> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('invalid email');
    }

    const checkPassword = await compare(password, user.password);

    if (!checkPassword) {
      throw new AppError('invalid password');
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

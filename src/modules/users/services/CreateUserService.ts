import { Entity, getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../infra/typeorm/entities/User';

interface UserRequest {
  name: string;
  email: string;
  password: string;
}

@Entity('users')
export default class CreateUserService {
  public async execute({ name, email, password }: UserRequest): Promise<User> {
    const usersRepository = getRepository(User);

    const userExists = await usersRepository.findOne('users', {
      where: { email },
    });

    if (userExists) {
      throw new Error('This email is already registered');
    }

    const hashPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashPassword,
    });
    const userSave = await usersRepository.save(user);

    return userSave;
  }
}

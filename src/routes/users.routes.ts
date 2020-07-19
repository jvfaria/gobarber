import { Router } from 'express';
import { getRepository } from 'typeorm';
import CreateUserService from '../services/CreateUserService';

import User from '../models/User';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
  try {
    const usersRepository = getRepository(User);
    const users = await usersRepository.find();

    return response.status(200).json(users);
  } catch (error) {
    return response.json({ message: error.message });
  }
});

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const userService = new CreateUserService();
    const user = await userService.execute({ name, email, password });

    delete user.password;
    return response.status(200).json(user);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default usersRouter;

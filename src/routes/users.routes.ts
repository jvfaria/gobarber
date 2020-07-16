import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../repositories/AppointmentsRepository';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
  try {
    const usersRepository = getCustomRepository(UsersRepository);
    const usersFounded = await usersRepository.find();
    const usersOrNot = usersFounded.length < 1 ? null : usersFounded;
    return response.status(200).json(usersOrNot);
  } catch (error) {
    const errorLog = error.message(
      `${error.message}`,
      "you don't have any users registered",
    );

    return response.status(200).json(errorLog);
  }
});

export default usersRouter;

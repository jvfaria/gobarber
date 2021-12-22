import { Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';
import CreateUserService from '../modules/users/services/CreateUserService';
import UpdateUserAvatarService from '../modules/users/services/UpdateUserAvatarService';
import verifyAuth from '../middlewares/verifyAuth';
import uploadConfig from '../config/upload';

import User from '../models/User';

const usersRouter = Router();
const upload = multer(uploadConfig);

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

usersRouter.patch(
  '/avatar',
  verifyAuth,
  upload.single('avatar'),
  async (request, response) => {
    try {
      const updateUserAvatarService = new UpdateUserAvatarService();
      const user = await updateUserAvatarService.execute({
        user_id: response.locals.userId,
        avatarFilename: request.file?.filename,
      });

      delete user.password;
      return response.json(user);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  },
);

export default usersRouter;

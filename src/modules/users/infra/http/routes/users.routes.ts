import { Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';
import User from '@modules/users/infra/typeorm/entities/User';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import verifyAuth from '@shared/infra/http/middlewares/verifyAuth';
import uploadConfig from '@config/upload';

const usersRouter = Router();
const upload = multer(uploadConfig);

interface IThing {
  prop: string;
}

interface IProportionalThing {
  prop?: string;
}

function deleteProp(prop: IThing) {
  const temp: IProportionalThing = prop;

  delete temp.prop;
  return temp;
}

usersRouter.get('/', async (request, response) => {
  try {
    const usersRepository = getRepository(User);
    const users = await usersRepository.find();

    return response.status(200).json(users);
  } catch (error) {
    return response.json({ message: error });
  }
});

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const userService = new CreateUserService();
    const user = await userService.execute({ name, email, password });

    const passwdToRemove: IThing = { prop: user.password };

    deleteProp(passwdToRemove);
    return response.status(200).json(user);
  } catch (error) {
    return response.status(400).json({ message: error });
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

      const passwdToRemove: IThing = { prop: user.password };

      deleteProp(passwdToRemove);
      return response.json(user);
    } catch (error) {
      return response.status(400).json({ message: error });
    }
  },
);

export default usersRouter;

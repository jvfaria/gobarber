import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../../../models/User';
import UploadConfig from '../../../config/upload';

interface Request {
  user_id: string;
  avatarFilename: string | undefined;
}
class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);
    console.log('user:', user_id);
    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new Error('Only authenticated users can change avatar');
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(UploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    if (!avatarFilename) {
      throw new Error('Avatar filename undefined');
    }
    user.avatar = avatarFilename;
    await usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;

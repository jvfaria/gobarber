import { Router } from 'express';
import AuthUserService from '../modules/users/services/AuthUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;
    const authService = new AuthUserService();
    const { user, token } = await authService.execute({ email, password });

    return response.status(200).json({ user, token });
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default sessionsRouter;

import appointmentsRouter from './appointments.routes';
import { Router } from 'express';

const routes = Router();

routes.use('/appointments', appointmentsRouter);



export default routes;  
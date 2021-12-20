import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import CreateAppointment from '../modules/appointments/services/CreateAppointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import verifyAuth from '../middlewares/verifyAuth';

const appointmentsRouter = Router();

appointmentsRouter.use(verifyAuth);

appointmentsRouter.get('/', async (request, response) => {
  try {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentsRepository.find();

    return response.status(200).json(appointments);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

appointmentsRouter.post('/', async (request, response) => {
  try {
    const { provider_id, date } = request.body;
    const parsedDate = parseISO(date);

    const appointmentService = new CreateAppointment();

    const appointment = await appointmentService.execute({
      provider_id,
      date: parsedDate,
    });

    return response.status(201).json(appointment);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default appointmentsRouter;

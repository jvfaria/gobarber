import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import CreateAppointment from '../services/CreateAppointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
  try {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const foundedAppointments = await appointmentsRepository.find();
    const appointmentsOrNot =
      foundedAppointments.length < 1
        ? { message: 'You have any appointments booked' }
        : foundedAppointments;

    return response.status(200).json(appointmentsOrNot);
  } catch (error) {
    return response
      .status(400)
      .json(`${error.message} you have no appointments`);
  }
});

appointmentsRouter.post('/', async (request, response) => {
  try {
    const { provider, date } = request.body;
    const parsedDate = parseISO(date);

    const appointmentService = new CreateAppointment();

    const appointment = await appointmentService.execute({
      provider,
      date: parsedDate,
    });

    return response.status(201).json(appointment);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default appointmentsRouter;

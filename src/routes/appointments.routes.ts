import { Router } from 'express';
import { parseISO } from 'date-fns';
import CreateAppointment from '../services/CreateAppointment';
import AppointmentRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();
const appointments = new AppointmentRepository();

appointmentsRouter.get('/', (request, response) => response.json(appointments.listAppointments()));
appointmentsRouter.post('/', (request, response) => {
  try {
    const { provider, date } = request.body;
    const parsedDate = parseISO(date);
    const appointmentService = new CreateAppointment(appointments);

    const appointment = appointmentService.execute({ provider, date: parsedDate });

    return response.status(201).json(appointment);
  } catch (error) {
    return response.status(400).json(error.message);
  }
});

export default appointmentsRouter;

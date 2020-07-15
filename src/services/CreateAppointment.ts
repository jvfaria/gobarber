import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import { uuid } from 'uuidv4';
import AppointmentRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';

interface AppointmentRequest {
  provider: string;
  date: Date;
}

export default class CreateAppointment {
  public async execute({
    provider,
    date,
  }: AppointmentRequest): Promise<Appointment> {
    const appointments = getCustomRepository(AppointmentRepository);

    const parsedDate = startOfHour(date);
    const verify = await appointments.verifyAppointment(parsedDate);

    if (verify) {
      throw Error('Could not create appointment in same date');
    } else {
      const appointment = appointments.create({
        id: uuid(),
        provider,
        date: parsedDate,
      });

      const appointmentSave = await appointments.save(appointment);
      return appointmentSave;
    }
  }
}

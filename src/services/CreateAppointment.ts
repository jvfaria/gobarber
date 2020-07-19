import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';

interface AppointmentRequest {
  provider_id: string;
  date: Date;
}

export default class CreateAppointment {
  public async execute({
    provider_id,
    date,
  }: AppointmentRequest): Promise<Appointment> {
    const appointments = getCustomRepository(AppointmentRepository);

    const parsedDate = startOfHour(date);
    const verify = await appointments.verifyAppointment(parsedDate);

    if (verify) {
      throw new Error('Could not create appointment in same date');
    } else {
      const appointment = appointments.create({
        provider_id,
        date: parsedDate,
      });

      const appointmentSave = await appointments.save(appointment);
      return appointmentSave;
    }
  }
}

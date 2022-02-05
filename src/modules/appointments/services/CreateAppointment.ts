import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppointmentRepository from '@modules/appointments/repositories/AppointmentsRepository';

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

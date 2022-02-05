import { startOfHour } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IAppointmentRequest {
  provider_id: string;
  date: Date;
}

export default class CreateAppointmentService {
  constructor(private appointmentsRepository: IAppointmentsRepository) {}

  public async execute({
    provider_id,
    date,
  }: IAppointmentRequest): Promise<Appointment> {
    const parsedDate = startOfHour(date);
    const verify = await this.appointmentsRepository.findByDate(parsedDate);

    if (verify) {
      throw new AppError('Could not create appointment in same date');
    } else {
      const savedAppointment = await this.appointmentsRepository.create({
        provider_id,
        date,
      });

      return savedAppointment;
    }
  }
}

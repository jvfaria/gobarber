import AppointmentRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';
import { startOfHour, parseISO } from 'date-fns';
interface AppointmentRequest {
  provider: string,
  date: Date,
};

export default class CreateAppointment {
  private appointments: AppointmentRepository;
  constructor(appointments: AppointmentRepository) {
    this.appointments = appointments;
  }

  public execute({provider, date}: AppointmentRequest): Appointment   {
    const parsedDate = startOfHour(date);
    const verify = this.appointments.verifyAppointment(parsedDate);


  if (verify) {
    throw Error("Could not create appointment in same date");
  } else {
    const appointment = this.appointments.create({
      provider,
      date: parsedDate
    });
    return appointment;
  }

  }

}
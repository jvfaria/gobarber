import Appointment from '../models/Appointment';
import { isEqual } from 'date-fns';

interface AppointmentDTO {
  provider: string,
  date: Date
}

class AppointmentRepository {
  private appointments: Appointment[];

  constructor() {
    this.appointments = []
  }

  public create({ provider,date }: AppointmentDTO): Appointment {
    const appointment = new Appointment({provider, date});
    this.appointments.push(appointment);

    return appointment;
  }

  public verifyAppointment(date: Date): Appointment | null {
    const verify = this.appointments.find(appointment => isEqual(appointment.date, date));

    return verify || null;


  }

  public listAppointments(): Appointment[] | {message:string} {
    const appointmentsOrNot = (this.appointments.length === 0)
      ? { message: "You don't have any appointments" }
      : this.appointments;

    return appointmentsOrNot;
  }

}

export default AppointmentRepository;


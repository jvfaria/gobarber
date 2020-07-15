import { EntityRepository, Repository } from 'typeorm';
import Appointment from '../models/Appointment';

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<Appointment> {
  public async verifyAppointment(date: Date): Promise<Appointment | undefined> {
    const find = await this.findOne({
      where: { date },
    });
    return find || undefined;
  }

  public async all(): Promise<Appointment | null> {
    const appointments = await this.all();
    return appointments || null;
  }
}

export default AppointmentRepository;

import { EntityRepository, Repository } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<Appointment> {
  public async verifyAppointment(date: Date): Promise<Appointment | undefined> {
    const find = await this.findOne({
      where: { date },
    });
    return find || undefined;
  }
}

export default AppointmentRepository;

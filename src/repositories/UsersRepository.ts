import { Repository, EntityRepository } from 'typeorm';
import User from '../models/User';

@EntityRepository()
export default class UsersRepository extends Repository<User> {}

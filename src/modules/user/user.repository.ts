//User/Quote Repository
import { Users } from 'src/entities/users.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Users)
export class UserRepository extends Repository<Users> { }

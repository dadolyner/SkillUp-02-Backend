// Locations Repository
import { EntityRepository, Repository } from 'typeorm';
import { Locations } from 'src/entities/locations.entity';

@EntityRepository(Locations)
export class AuthRepository extends Repository<Locations> {

}

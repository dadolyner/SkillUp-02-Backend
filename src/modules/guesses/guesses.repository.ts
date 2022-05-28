// Guesses Repository
import { EntityRepository, Repository } from 'typeorm';
import { Guesses } from 'src/entities/guesses.entity';

@EntityRepository(Guesses)
export class AuthRepository extends Repository<Guesses> {
    
}
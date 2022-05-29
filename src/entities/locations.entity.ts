// Locations Entity
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Guesses } from './guesses.entity';
import { Users } from './users.entity';

@Entity()
export class Locations extends BaseEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    latitude: string;

    @Column()
    longitude: string;

    @Column()
    image: string;

    @Column()
    timestamp: Date;

    @Column()
    userId: string;

    // Relation
    // User
    @ManyToOne(() => Users, user => user.locations, { onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
    user: Users;
    
    // Guesses
    @OneToMany(() => Guesses, guess => guess.location, { onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
    guess: Guesses[];
}

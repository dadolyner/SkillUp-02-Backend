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
    date: string;

    @Column()
    userId: string;

    // Relation
    @ManyToOne(() => Users, user => user.locations, { onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
    user: Users;

    @OneToMany(() => Guesses, guess => guess.location, { onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
    guesses: Guesses[];
}

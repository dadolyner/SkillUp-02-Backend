// Guesses Entity
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
} from 'typeorm';
import { Locations } from './locations.entity';
import { Users } from './users.entity';

@Entity()
export class Guesses extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    distance: number;

    @Column()
    userId: string;

    @Column()
    locationId: string;

    // Relations
    @ManyToOne(() => Users, user => user.guesses, { onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
    user: Users;

    @ManyToOne(() => Locations, location => location.guesses, { onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
    location: Locations;
}

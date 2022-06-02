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
    latitude: string;

    @Column()
    longitude: string;

    @Column()
    distance: number;

    @Column()
    timestamp: Date;

    @Column()
    userId: string;

    @Column()
    locationId: string;

    @Column()
    locationImage: string;

    // Relations
    // User
    @ManyToOne(() => Users, user => user.guess, { onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
    user: Users;
    
    // Location
    @ManyToOne(() => Locations, location => location.guess, { onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
    location: Locations;
}

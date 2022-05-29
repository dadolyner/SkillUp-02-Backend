// Users Entity
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    Unique,
    OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Guesses } from './guesses.entity';
import { Locations } from './locations.entity';

@Entity()
@Unique(['email'])
export class Users extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    email: string;

    @Column()
    salt: string;

    @Column()
    password: string;

    @Column()
    avatar: string;

    // Relation
    // Guess
    @OneToMany(() => Guesses, guess => guess.user, { onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
    guess: Guesses[];
    
    // Location
    @OneToMany(() => Locations, location => location.user, { onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
    locations: Locations[];

    // Validate user password with bcrypt
    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}

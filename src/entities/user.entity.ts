//User Entity
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    Unique,
    OneToMany,
    OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Vote } from './vote.entity';
import { Quote } from './quote.entity';

@Entity()
@Unique(['username', 'email'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    salt: string;

    @Column()
    password: string;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

    //relation
    @OneToMany(() => Vote, (vote) => vote.user, { onDelete: 'CASCADE' })
    votes: Vote[];

    @OneToOne(() => Quote, (quote) => quote.user, { onDelete: 'CASCADE' })
    quote: Quote;
}

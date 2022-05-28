//Vote entity
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Quote } from './quote.entity';
import { User } from './user.entity';

@Entity()
export class Vote extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    vote: number;

    @Column()
    quoteId: string;

    //relation
    @ManyToOne(() => User, (user) => user.votes, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @ManyToOne(() => Quote, (quote) => quote.votes, { onDelete: 'CASCADE' })
    @JoinColumn()
    quote: Quote;
}

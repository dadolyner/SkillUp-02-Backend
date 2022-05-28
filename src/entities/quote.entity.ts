//Quote entity
import {
	BaseEntity,
	Column,
	Entity,
	OneToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Vote } from './vote.entity';

@Entity()
export class Quote extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	quote: string;

	@OneToMany(() => Vote, (vote) => vote.quote, { onDelete: 'CASCADE' })
	votes: Vote[];

	@OneToOne(() => User, (user) => user.quote, { onDelete: 'CASCADE' })
	@JoinColumn()
	user: User;
}

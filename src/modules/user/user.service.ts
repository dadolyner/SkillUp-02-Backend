//User/Quote Service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { Users } from '../../entities/users.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) { }

    //outputs user info without sensitive data
    async getUserInfo(user: Users): Promise<Users> {
        const userInfo = await this.userRepository
            .createQueryBuilder()
            .select([
                'user.id',
                'user.first_name',
                'user.last_name',
                'user.email',
                'location.id',
                'location.latitude',
                'location.longitude',
                'location.image',
                'location.timestamp',
                'guess.id',
                'guess.latitude',
                'guess.longitude',
                'guess.distance',
                'guess.timestamp',
            ])
            .from(Users, 'user')
            .leftJoin('user.locations', 'location')
            .leftJoin('user.guesses', 'guess')
            .where('user.id = :id', { id: user.id })
            .getOne();

        return userInfo;
    }

    //outputs selected user info by passing in his UUID without sensitive data
    async getUserInfoById(userId: string): Promise<Users> {
        const userInfo = await this.userRepository
            .createQueryBuilder()
            .select([
                'user.id',
                'user.first_name',
                'user.last_name',
                'user.email',
                'location.id',
                'location.latitude',
                'location.longitude',
                'location.image',
                'location.timestamp',
                'guess.id',
                'guess.latitude',
                'guess.longitude',
                'guess.distance',
                'guess.timestamp',
            ])
            .from(Users, 'user')
            .leftJoin('user.locations', 'location')
            .leftJoin('user.guesses', 'guess')
            .where(userId)
            .getOne();

        return userInfo;
    }
}

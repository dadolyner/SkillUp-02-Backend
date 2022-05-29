//User/Quote Service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { Users } from '../../entities/users.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class UserService {
    private logger = new Logger('UserService');
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) { }

    //outputs user info without sensitive data
    async getUserInfo(user: Users): Promise<Users> {
        try {
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

            this.logger.verbose(`Information for logedin user ${user.id} successfully retrieved!`);
            return userInfo;
        } catch (error) {
            return error;
        }
    }

    //outputs selected user info by passing in his UUID without sensitive data
    async getUserInfoById(userId: string): Promise<Users> {
        try {
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

            this.logger.verbose(`Information for user ${userInfo.first_name} ${userInfo.last_name} successfully retrieved!`);
            return userInfo;
        } catch (error) {
            return error;
        }
    }
}

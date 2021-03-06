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

    // Get logged in user info
    async getUserInfo(user: Users): Promise<Users> {
        
            const userInfo = await this.userRepository
                .createQueryBuilder()
                .select([
                    'user.id',
                    'user.first_name',
                    'user.last_name',
                    'user.email',
                    'user.avatar',
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
                    'guess.locationId',
                    'guess.locationImage'
                ])
                .from(Users, 'user')
                .leftJoin('user.location', 'location')
                .leftJoin('user.guess', 'guess')
                .where('user.id = :id', { id: user.id })
                .getOne();

            this.logger.verbose(`Information for user with email: ${userInfo.email} successfully retrieved!`);
            return userInfo;
        
    }

    // Get user info by its id
    async getUserInfoById(userId: string): Promise<Users> {
        try {
            const userInfo = await this.userRepository
                .createQueryBuilder()
                .select([
                    'user.id',
                    'user.first_name',
                    'user.last_name',
                    'user.email',
                    'user.avatar',
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
                .leftJoin('user.location', 'location')
                .leftJoin('user.guess', 'guess')
                .where(userId)
                .getOne();

            this.logger.verbose(`Information for user with email: ${userInfo.email} successfully retrieved!`);
            return userInfo;
        } catch (error) {
            return error;
        }
    }
}

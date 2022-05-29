//Authorization Repository
import {
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthLoginCredentialsDto } from './dto/auth-credentials-login.dto';
import { Users } from 'src/entities/users.entity';
import * as bcrypt from 'bcrypt';
import { AuthSignUpCredentialsDto } from './dto/auth-credentials-signup.dto';
import { Logger } from '@nestjs/common';
import { AuthChangeInfoDto } from './dto/auth-changeInfo.dto';

@EntityRepository(Users)
export class AuthRepository extends Repository<Users> {
    private logger = new Logger('AuthRepository');

    //register user into database
    async register(signupCredentials: AuthSignUpCredentialsDto): Promise<void> {
        const { first_name, last_name, email, password, avatar } = signupCredentials;

        const user = new Users();
        user.first_name = first_name;
        user.last_name = last_name;
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        user.avatar = avatar;

        try { await this.save(user) }
        catch (error) {
            if (error.code == 23505) {
                this.logger.error(`User with email: ${email} already exists`);
                throw new ConflictException('User with this email already exist!');
            } else {
                throw new InternalServerErrorException();
            }
        }

        this.logger.verbose(`User with email: ${email} successfully registered!`);
    }

    // Change user information
    async changeUserInfo(user: Users, userInfo: AuthChangeInfoDto): Promise<void> {
        const { first_name, last_name, email } = userInfo;
        
        try {    
            const currentUser = await this.findOne(user);
            currentUser.first_name = first_name;
            currentUser.last_name = last_name;
            currentUser.email = email;
            
            this.logger.verbose(`User ${currentUser.first_name} ${currentUser.last_name} successfully changed its information!`);
            await this.save(currentUser);
        } catch (error) {
            this.logger.error(`User with email ${email} already exists!`);
            throw new InternalServerErrorException();
        }
    }

    // Change user password
    async changePassword(user: Users, oldPassword: string, newPassword: string): Promise<void> {
        try {
            const currentUser = await this.findOne(user);
            if (await currentUser.validatePassword(oldPassword)) {
                currentUser.password = await this.hashPassword(newPassword, currentUser.salt);
                this.logger.verbose(`User ${currentUser.first_name} ${currentUser.last_name} successfully changed its password!`);
                await this.save(currentUser);
            } else {
                this.logger.error(`User ${currentUser.first_name} ${currentUser.last_name} entered wrong old password!`);
                throw new InternalServerErrorException();
            }
        } catch (error) {
            return error;
        }
    }

    // Change user avatar
    async changeAvatar(user: Users, image: string): Promise<void> {
        const currentUser = await this.findOne(user);
        currentUser.avatar = image.toString();
        this.logger.verbose(`User ${currentUser.first_name} ${currentUser.last_name} successfully changed its profile image!`);
        await this.save(currentUser);
    }

    //validate inserted password
    async validateUserPassword(userCredentialsDto: AuthLoginCredentialsDto): Promise<string> {
        const { email, password } = userCredentialsDto;
        const user = await this.findOne({ email });

        if (user && (await user.validatePassword(password))) return user.email;
        else return null;
    }

    //hash password
    private hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }
}

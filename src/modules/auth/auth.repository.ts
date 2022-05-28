//Authorization Repository
import {
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthLoginCredentialsDto } from './dto/auth-credentials-login.dto';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthSignUpCredentialsDto } from './dto/auth-credentials-signup.dto';
import { Logger } from '@nestjs/common';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
    private logger = new Logger('AuthRepository');
    //signup our user into the database
    async signUp(signupCredentials: AuthSignUpCredentialsDto): Promise<void> {
        const { first_name, last_name, email, password, avatar } = signupCredentials;

        const user = new User();
        user.first_name = first_name;
        user.last_name = last_name;
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        user.avatar = avatar;

        try {
            await this.save(user);
        } catch (error) {
            if (error.code == 23505) {
                this.logger.error(`User with email: ${email} already exists`);
                throw new ConflictException('User with this email already exist!');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    //validate inserted password
    async validateUserPassword(userCredentialsDto: AuthLoginCredentialsDto): Promise<string> {
        const { email, password } = userCredentialsDto;
        const user = await this.findOne({ email });

        if (user && (await user.validatePassword(password))) {
            return user.email;
        } else {
            return null;
        }
    }

    //hash password
    private hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }
}

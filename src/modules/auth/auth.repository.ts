//Authorization Repository
import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthLoginCredentialsDto } from './dto/auth-credentials-login.dto';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthSignUpCredentialsDto } from './dto/auth-credentials-signup.dto';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
    //signup our user into the database
    async signUp(signupCredentials: AuthSignUpCredentialsDto): Promise<void> {
        const { first_name, last_name, email, username, password } =
            signupCredentials;

        const user = new User();
        user.first_name = first_name;
        user.last_name = last_name;
        user.username = username;
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            await this.save(user);
        } catch (error) {
            if (error.code == 23505) {
                throw new ConflictException('Username already exist!');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async updateUser(
        signupCredentials: AuthSignUpCredentialsDto,
        user: User,
    ): Promise<User> {
        const { first_name, last_name, email, username, password } =
            signupCredentials;
        const userInfo = await this.findOne(user);

        if (!userInfo) {
            throw new NotFoundException(
                `Unable to find user with: "${signupCredentials}".`,
            );
        } else {
            userInfo.first_name = first_name;
            userInfo.last_name = last_name;
            userInfo.username = username;
            userInfo.email = email;
            userInfo.salt = await bcrypt.genSalt();
            userInfo.password = await this.hashPassword(password, userInfo.salt);

            try {
                await this.update(userInfo.id, userInfo);
            } catch (error) {
                if (error.code == 23505) {
                    throw new ConflictException('Username or email already exist!');
                } else {
                    throw new InternalServerErrorException();
                }
            }

            return userInfo;
        }
    }

    //validate inserted password
    async validateUserPassword(
        userCredentialsDto: AuthLoginCredentialsDto,
    ): Promise<string> {
        const { email, password } = userCredentialsDto;
        const user = await this.findOne({ email });

        if (user && (await user.validatePassword(password))) {
            return user.username;
        } else {
            return null;
        }
    }

    //hash password
    private hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }
}

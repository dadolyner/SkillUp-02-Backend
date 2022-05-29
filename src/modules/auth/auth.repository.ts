// Authorization Repository
import {
    ConflictException,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthLoginCredentialsDto } from './dto/auth-credentials-login.dto';
import { Users } from 'src/entities/users.entity';
import * as bcrypt from 'bcrypt';
import { AuthSignUpCredentialsDto } from './dto/auth-credentials-signup.dto';
import { Logger } from '@nestjs/common';
import { AuthChangeInfoDto } from './dto/auth-changeInfo.dto';
import transporter from '../../mail/mailConfig';

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
            this.logger.error(`User with email: ${email} already exists!`);
            throw new InternalServerErrorException();
        }
    }

    // Send request password mail to user
    async requestPasswordChange(user: Users): Promise<void> {
        const currentUser = await this.findOne(user);
        const { first_name, last_name, email } = currentUser;

        try {
            const passRequestToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const passRequestTokenExpiryDate = new Date(new Date().getTime() + 600000);

            currentUser.passRequestToken = passRequestToken
            currentUser.passRequestTokenExpiryDate = passRequestTokenExpiryDate.toString();

            transporter.sendMail({
                from: '"Geotagger Support" <skulj@geotagger.com>',
                to: email,
                subject: 'Password change request',
                text: ``,
                html: `<h3>Hello ${first_name} ${last_name}</h3>
                        <p>You have requested to change your password. Please click on the link below to change your password.</p>
                        <a href="http://localhost:3000/auth/change-password/${passRequestToken}">Change password</a>`,
            });

            this.logger.verbose(`User with email: ${currentUser.email} has requested password change!`);
            await this.save(currentUser);
        } catch (error) {
            this.logger.error(`User with email ${email} does not exist!`);
            throw new InternalServerErrorException();
        }
    }

    // Change user password
    async changePassword(user: Users, token: string, oldPassword: string, newPassword: string): Promise<void> {
        try {
            const currentUser = await this.findOne(user);
            if (!currentUser.passRequestToken || currentUser.passRequestTokenExpiryDate < new Date().toString()) { this.logger.error(`Reset password token for user with email: ${currentUser.email} has expired!`); throw new UnauthorizedException();}
            if (!await currentUser.validatePassword(oldPassword)) { this.logger.error(`User with email: ${currentUser.email} entered wrong old password!`); throw new InternalServerErrorException();}

            currentUser.password = await this.hashPassword(newPassword, currentUser.salt);
            currentUser.passRequestToken = null;
            currentUser.passRequestTokenExpiryDate = null;

            transporter.sendMail({
                from: '"Geotagger Support" <skulj@geotagger.com>',
                to: currentUser.email,
                subject: 'Password change request',
                text: ``,
                html: `<p>Your password has been changed successfully!</p>`,
            });

            this.logger.verbose(`User with email: ${currentUser.email} successfully changed its password!`);
            await this.save(currentUser);
        } catch (error) { return error; }
    }

    // Change user avatar
    async changeAvatar(user: Users, image: string): Promise<void> {
        const currentUser = await this.findOne(user);
        try {
            currentUser.avatar = image.toString();
            this.logger.verbose(`User with email: ${currentUser.email} has successfully changed its profile image!`);
            await this.save(currentUser);
        } catch (error) {
            this.logger.error(`There was an error trying to update profile image for user with email: ${currentUser.email}!`);
            throw new InternalServerErrorException();
        }
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

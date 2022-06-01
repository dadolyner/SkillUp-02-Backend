//Authorization Service
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthLoginCredentialsDto } from './dto/auth-credentials-login.dto';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { AuthSignUpCredentialsDto } from './dto/auth-credentials-signup.dto';
import { Logger } from '@nestjs/common';
import { Users } from '../../entities/users.entity';
import { AuthChangeInfoDto } from './dto/auth-changeInfo.dto';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthSevice');
    constructor(
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository,
        private jwtService: JwtService,
    ) { }

    //register
    async register(signupCredentials: AuthSignUpCredentialsDto): Promise<void> {
        return this.authRepository.register(signupCredentials);
    }

    //login
    async logIn(userCredentialsDto: AuthLoginCredentialsDto): Promise<{ accesToken: string }> {
        const { email } = userCredentialsDto;
        const emailExists = await this.authRepository.findOne({ email });
        const validate = await this.authRepository.validateUserPassword(userCredentialsDto);

        try {
            if (!validate) {
                if (!emailExists) {
                    this.logger.error(`User with email: ${userCredentialsDto.email} does not exist!`);
                    throw new UnauthorizedException('Email not exists');
                } else {
                    this.logger.error(`User tried to login but has entered Invalid credentials`);
                    throw new UnauthorizedException('Invalid credentials');
                }
            }

            const payload: JwtPayload = { email };
            const accesToken = await this.jwtService.sign(payload);

            this.logger.verbose(`User with email: ${userCredentialsDto.email} logged in!`);

            return { accesToken };
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    // Request password reset
    async requestPasswordChange(user: Users): Promise<void> {
        return this.authRepository.requestPasswordChange(user);
    }

    // Update user password
    async changePassword(user: Users, token: string, oldPassword: string, newPassword: string): Promise<void> {
        return this.authRepository.changePassword(user, token, oldPassword, newPassword);
    }

    // Change user information
    async changeUserInfo(user: Users, userInfo: AuthChangeInfoDto): Promise<void> {
        return this.authRepository.changeUserInfo(user, userInfo);
    }

    // Update user avatar
    async changeAvatar(user: Users, image: string): Promise<void> {
        return this.authRepository.changeAvatar(user, image);
    }
}

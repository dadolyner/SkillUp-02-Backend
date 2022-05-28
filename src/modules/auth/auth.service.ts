//Authorization Service
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthLoginCredentialsDto } from './dto/auth-credentials-login.dto';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { AuthSignUpCredentialsDto } from './dto/auth-credentials-signup.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository,
        private jwtService: JwtService,
    ) { }

    //signup - registration
    async signUp(signupCredentials: AuthSignUpCredentialsDto): Promise<void> {
        return this.authRepository.signUp(signupCredentials);
    }

    //signup - registration
    async updateUser(
        signupCredentials: AuthSignUpCredentialsDto,
        user: User,
    ): Promise<User> {
        return this.authRepository.updateUser(signupCredentials, user);
    }

    //signin - login with jwt tokens
    async logIn(
        userCredentialsDto: AuthLoginCredentialsDto,
    ): Promise<{ accesToken: string }> {
        const username = await this.authRepository.validateUserPassword(
            userCredentialsDto,
        );

        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { username };
        const accesToken = await this.jwtService.sign(payload);

        return { accesToken };
    }
}

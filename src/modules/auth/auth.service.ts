//Authorization Service
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthLoginCredentialsDto } from './dto/auth-credentials-login.dto';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { AuthSignUpCredentialsDto } from './dto/auth-credentials-signup.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthSevice');
    constructor(
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository,
        private jwtService: JwtService,
    ) { }

    //signup - registration
    async signUp(signupCredentials: AuthSignUpCredentialsDto): Promise<void> {
        return this.authRepository.signUp(signupCredentials);
    }

    //signin - login with jwt tokens
    async logIn(userCredentialsDto: AuthLoginCredentialsDto): Promise<{ accesToken: string }> {
        const { email } = userCredentialsDto;
        const emailExists = await this.authRepository.findOne({ email });
        const validate = await this.authRepository.validateUserPassword(userCredentialsDto);

        if (!validate) {
            if(!emailExists) {
                this.logger.error(`User with email: ${userCredentialsDto.email} does not exist!`);
                throw new UnauthorizedException('Email not exists');
            } else {
                this.logger.error(`Invalid credentials`);
                throw new UnauthorizedException('Invalid credentials');
            }
        }

        const payload: JwtPayload = { email };
        const accesToken = await this.jwtService.sign(payload);

        this.logger.verbose(`User with email: ${userCredentialsDto.email} logged in!`);
        
        return { accesToken };
    }
}

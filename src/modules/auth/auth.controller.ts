//Authorization Controller
import {
    Body,
    Controller,
    Post,
    ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginCredentialsDto } from './dto/auth-credentials-login.dto';
import { AuthSignUpCredentialsDto } from './dto/auth-credentials-signup.dto';
import { Logger } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthController');
    constructor(private authService: AuthService) { }

    //post request for signup
    @Post('/signup')
    signUp(
        @Body(ValidationPipe)
        authSignupCredentialsDto: AuthSignUpCredentialsDto,
    ): Promise<void> {
        const { first_name, last_name, email } = authSignupCredentialsDto;
        this.logger.verbose(`New user added: ${first_name} ${last_name} ${email}`);
        return this.authService.signUp(authSignupCredentialsDto);
    }

    //post request for signin
    @Post('/login')
    logIn(
        @Body(ValidationPipe)
        authCredentialsDto: AuthLoginCredentialsDto,
    ): Promise<{ accesToken: string }> {
        const { email } = authCredentialsDto;
        this.logger.verbose(`User with email: ${email} just logged in!`);
        return this.authService.logIn(authCredentialsDto);
    }
}

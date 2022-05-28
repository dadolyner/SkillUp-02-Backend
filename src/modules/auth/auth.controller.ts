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

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    //post request for signup
    @Post('/signup')
    signUp(@Body(ValidationPipe) authSignupCredentialsDto: AuthSignUpCredentialsDto): Promise<void> {
        return this.authService.signUp(authSignupCredentialsDto);
    }

    //post request for signin
    @Post('/login')
    logIn(@Body(ValidationPipe) authCredentialsDto: AuthLoginCredentialsDto): Promise<{ accesToken: string }> {
        return this.authService.logIn(authCredentialsDto);
    }
}

//Authorization Controller
import {
    Body,
    Controller,
    Patch,
    Post,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import { GetUser } from './decorator/get-user.decorator';
import { AuthLoginCredentialsDto } from './dto/auth-credentials-login.dto';
import { AuthSignUpCredentialsDto } from './dto/auth-credentials-signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    //post request for signup
    @Post('/signup')
    signUp(
        @Body(ValidationPipe)
        authSignupCredentialsDto: AuthSignUpCredentialsDto,
    ): Promise<void> {
        return this.authService.signUp(authSignupCredentialsDto);
    }

    //post request for signup
    @UseGuards(AuthGuard())
    @Patch('/update')
    updateUser(
        @Body(ValidationPipe)
        authSignupCredentialsDto: AuthSignUpCredentialsDto,
        @GetUser() user: User,
    ): Promise<User> {
        return this.authService.updateUser(authSignupCredentialsDto, user);
    }

    //post request for signin
    @Post('/login')
    logIn(
        @Body(ValidationPipe)
        authCredentialsDto: AuthLoginCredentialsDto,
    ): Promise<{ accesToken: string }> {
        return this.authService.logIn(authCredentialsDto);
    }
}

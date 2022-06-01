// Authorization Controller
import {
    Body,
    Controller,
    Param,
    Patch,
    Post,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Users } from '../../entities/users.entity';
import { AuthService } from './auth.service';
import { GetUser } from './decorator/get-user.decorator';
import { AuthChangeInfoDto } from './dto/auth-changeInfo.dto';
import { AuthLoginCredentialsDto } from './dto/auth-credentials-login.dto';
import { AuthSignUpCredentialsDto } from './dto/auth-credentials-signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // User signup
    @Post('/register')
    register(@Body(ValidationPipe) authSignupCredentialsDto: AuthSignUpCredentialsDto): Promise<void> {
        return this.authService.register(authSignupCredentialsDto);
    }

    // User login
    @Post('/login')
    logIn(@Body(ValidationPipe) authCredentialsDto: AuthLoginCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.logIn(authCredentialsDto);
    }

    // Change user info
    @UseGuards(AuthGuard())
    @Patch('/change-userInfo')
    changeUserInfo(@GetUser() user: Users, @Body() userInfo: AuthChangeInfoDto): Promise<void> {
        return this.authService.changeUserInfo(user, userInfo);
    }

    // Request password reset
    @UseGuards(AuthGuard())
    @Post('/request-password-change')
    requestPasswordChange(@GetUser() user: Users): Promise<{ passRequestToken:string }> {
        return this.authService.requestPasswordChange(user);
    }

    // Change user password
    @UseGuards(AuthGuard())
    @Patch('/change-password/:token')
    changePassword(@GetUser() user: Users, @Param('token') token: string, @Body('oldPassword') oldPassword: string, @Body('newPassword') newPassword: string): Promise<void> {
        return this.authService.changePassword(user, token, oldPassword, newPassword);
    }

    // Change user avatar
    @UseGuards(AuthGuard())
    @Patch('/change-profile-image')
    changeAvatar(@GetUser() user: Users, @Body('image') image: string): Promise<void> {
        return this.authService.changeAvatar(user, image);
    }
}

//User/Quote Controller
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { GetUser } from 'src/modules/auth/decorator/get-user.decorator';
import { Users } from 'src/entities/users.entity';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }
    
    // Get logged in user info
    @UseGuards(AuthGuard())
    @Get('/me')
    getUserInfo(@GetUser() user: Users) {
        return this.userService.getUserInfo(user);
    }

    // Get user information by its id
    @Get('/:id')
    getUserInfoById(@Param() userId: string) {
        return this.userService.getUserInfoById(userId);
    }
}

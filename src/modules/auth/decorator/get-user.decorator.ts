//Get User Decorator
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

//data of user
export const GetUser = createParamDecorator(
    (_data, ctx: ExecutionContext): User => {
        const req = ctx.switchToHttp().getRequest();
        return req.user;
    },
);

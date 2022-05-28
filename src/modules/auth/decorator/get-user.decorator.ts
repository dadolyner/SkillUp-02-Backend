//Get User Decorator
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Users } from 'src/entities/users.entity';

//data of user
export const GetUser = createParamDecorator(
    (_data, ctx: ExecutionContext): Users => {
        const req = ctx.switchToHttp().getRequest();
        return req.user;
    },
);

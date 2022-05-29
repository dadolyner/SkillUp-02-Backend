import { LocationModule } from './location/location.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfig } from '../config/config.typeorm';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        TypeOrmConfig,
        AuthModule,
        LocationModule,
        UserModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }

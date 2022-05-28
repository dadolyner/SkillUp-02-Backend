import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfig } from '../config/config.typeorm';

@Module({
    imports: [ 
        TypeOrmConfig,
        AuthModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }

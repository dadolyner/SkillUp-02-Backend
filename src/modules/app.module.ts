import { LocationModule } from './location/location.module';
import { LocationController } from './location/location.controller';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfig } from '../config/config.typeorm';

@Module({
    imports: [
        LocationModule,
        TypeOrmConfig,
        AuthModule
    ],
    controllers: [
        LocationController,],
    providers: [],
})
export class AppModule { }

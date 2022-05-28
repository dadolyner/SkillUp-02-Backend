import { GuessesModule } from './guesses/guesses.module';
import { LocationModule } from './location/location.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfig } from '../config/config.typeorm';

@Module({
    imports: [
        TypeOrmConfig,
        AuthModule,
        GuessesModule,
        LocationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guesses } from 'src/entities/guesses.entity';
import { Locations } from 'src/entities/locations.entity';
import { Users } from 'src/entities/users.entity';
import { AuthModule } from '../modules/auth/auth.module';

@Module({
    imports: [ 
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService : ConfigService) => ({
                type: 'postgres',
	            host: configService.get<string>('DATABASE_HOST'),
	            port: +configService.get<number>('DATABASE_PORT'),
	            username: configService.get<string>('DATABASE_USER'),
	            password: configService.get<string>('DATABASE_PASSWORD'),
	            database: configService.get<string>('DATABASE_NAME'),
	            entities: [Users, Locations, Guesses],
	            synchronize: true,
            }),
            inject: [ConfigService],
        }),
        AuthModule],
    controllers: [],
    providers: [],
})
export class TypeOrmConfig { }
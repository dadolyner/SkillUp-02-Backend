// Locations Module
import { LocationService } from './location.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from './location.controller';
import { LocationRepository } from './location.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        TypeOrmModule.forFeature([LocationRepository]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [LocationController],
    providers: [LocationService],
})
export class LocationModule { }

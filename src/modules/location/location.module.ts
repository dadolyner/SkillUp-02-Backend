// Locations Module
import { LocationService } from './location.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from './location.controller';
import { Locations } from 'src/entities/locations.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Locations])],
    controllers: [LocationController],
    providers: [LocationService],
})
export class LocationModule { }

// Locations Module
import { LocationService } from './location.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from './location.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Location])],
    controllers: [LocationController],
    providers: [LocationService],
})
export class LocationModule { }

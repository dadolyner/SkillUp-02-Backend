// Locations Service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationRepository } from './location.repository';
import { Locations } from 'src/entities/locations.entity';
import { LocationParameters } from './dto/location-parameters.dto';
import { Users } from 'src/entities/users.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class LocationService {
    private logger = new Logger('LocationService');
    constructor(
        @InjectRepository(LocationRepository)
        private locationRepository: LocationRepository,
    ) { }

    // Get all locations with limit
    async getLocations(locationsLimit: number): Promise<Locations[]> {
        try {
            const getLocations = await this.locationRepository
            .createQueryBuilder()
            .select([
                'location.id', 
                'location.latitude', 
                'location.longitude', 
                'location.image', 
                'location.date', 
                'location.userId'
            ])
            .from(Locations, 'location')
            .take(locationsLimit)
            .getMany();

            this.logger.verbose(`All ${getLocations.length} locations successfully retrieved!`);
            return getLocations;
        } catch (error) {
            return error;
        }
    }

    // Get Random Location
    async getRandomLocation(): Promise<Locations> {
        try {
            const getRandomLocation = this.locationRepository
            .createQueryBuilder()
            .select([
                'location.latitude', 
                'location.longitude', 
                'location.image', 
                'location.date', 
                'location.userId'
            ])
            .from(Locations, 'location')
            .orderBy('RANDOM()')
            .limit(1)
            .getOne();

            this.logger.verbose(`Random location successfully retrieved!`);
            return getRandomLocation;
        } catch (error) {
            return error;
        }
    }

    // Create Location
    async createLocation(user: Users, locationParameters: LocationParameters): Promise<Locations> {
        return this.locationRepository.createLocation(user, locationParameters);
    }

    // Delete Location
    async deleteLocation(user: Users, id: string): Promise<Locations> {
        return this.locationRepository.deleteLocation(user, id);
    }
}

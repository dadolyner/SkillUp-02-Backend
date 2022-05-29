// Locations Service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationRepository } from './location.repository';
import { Locations } from 'src/entities/locations.entity';
import { LocationParameters } from './dto/location-parameters.dto';
import { Users } from 'src/entities/users.entity';
import { Logger } from '@nestjs/common';
import { GuessParameters } from './dto/guess-parameters.dto';
import { Guesses } from 'src/entities/guesses.entity';

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

    // Guess Location by id
    async guessLocation(user: Users, id: string, guessParameters: GuessParameters): Promise<Guesses> {
        const { latitude, longitude } = guessParameters;
        const location = await this.locationRepository.findOne(id);
        const guess = new Guesses();
        guess.latitude = latitude;
        guess.longitude = longitude;
        guess.distance = this.calculateDistance(+location.latitude, +location.longitude, +latitude, +longitude);
        guess.user = user;
        guess.location = location
        guess.timestamp = new Date().toISOString();

        try {
            await guess.save(); 
            this.logger.verbose(`User ${user.first_name} ${user.last_name} successfully guessed the location with id ${id}!`);
        } catch (error) { return error; }
    }

    // Convert degrees to radians
    toRad(value: number): number { return value * Math.PI / 180 }

    // Calculate distance between two points
    calculateDistance(lat1: number, long1: number, lat2: number, long2: number): number {
        const R = 6371; 
        const latDiff = this.toRad(lat2-lat1);
        const lonDiff = this.toRad(long2-long1);
        const latitude1 = this.toRad(lat1);
        const latitude2 = this.toRad(lat2);

        const a = Math.sin(latDiff/2) * Math.sin(latDiff/2) + Math.sin(lonDiff/2) * Math.sin(lonDiff/2) * Math.cos(latitude1) * Math.cos(latitude2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const d = R * c;
        
        return Math.trunc(d);
    }
}

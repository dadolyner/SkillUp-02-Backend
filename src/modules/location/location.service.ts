// Locations Service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationRepository } from './location.repository';
import { Locations } from '../../entities/locations.entity';
import { LocationParameters } from './dto/location-parameters.dto';
import { Users } from '../../entities/users.entity';
import { Logger } from '@nestjs/common';
import { GuessParameters } from './dto/guess-parameters.dto';
import { Guesses } from '../../entities/guesses.entity';

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
                    'location.timestamp',
                    'location.userId'
                ])
                .from(Locations, 'location')
                .limit(locationsLimit)
                .getMany();

            this.logger.verbose(`Successfully retrieved all ${getLocations.length} locations!`);
            return getLocations;
        } catch (error) {
            return error;
        }
    }

    // Get all info from location by its id
    async getLocationById(id: string): Promise<Locations> {
        return this.locationRepository.findOne(id);
    }

    // Get Random Location
    async getRandomLocation(): Promise<Locations> {
        try {
            const getRandomLocation = this.locationRepository
                .createQueryBuilder()
                .select([
                    'location.id',
                    'location.latitude',
                    'location.longitude',
                    'location.image',
                    'location.timestamp',
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

    // Get all guesses for a location
    async getGuesses(id: string): Promise<Guesses[]> {
        try {
            const getGuesses = await this.locationRepository
                .createQueryBuilder()
                .select([
                    'guess.id',
                    'guess.latitude',
                    'guess.longitude',
                    'guess.distance',
                    'guess.timestamp',
                    'userGuessed.first_name',
                    'userGuessed.last_name',
                ])
                .from(Guesses, 'guess')
                .leftJoin('guess.user', 'userGuessed')
                .where('guess.locationId = :id', { id })
                .orderBy('guess.distance', 'ASC')
                .getMany();

            this.logger.verbose(`Successfully retrieved ${getGuesses.length} guesses for location with id: ${id}!`);
            return getGuesses;
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

    // Edit Location
    async editLocation(user: Users, id: string, locationParameters: LocationParameters): Promise<Locations> {
        return this.locationRepository.editLocation(user, id, locationParameters);
    }

    // Guess Location by id
    async guessLocation(user: Users, id: string, guessParameters: GuessParameters): Promise<Guesses> {
        const { latitude, longitude } = guessParameters;
        const location = await this.locationRepository.findOne(id);

        // Check if this user already guessed this location
        const checkGuess = await this.locationRepository
            .createQueryBuilder()
            .select([
                'guess.id',
                'guess.latitude',
                'guess.longitude',
                'guess.distance',
                'guess.timestamp',
                'userGuessed.first_name',
                'userGuessed.last_name',
            ])
            .from(Guesses, 'guess')
            .leftJoin('guess.user', 'userGuessed')
            .where('guess.locationId = :id', { id })
            .andWhere('guess.userId = :userId', { userId: user.id })
            .getOne();

        if (checkGuess) {
            this.logger.error(`User with email: ${user.email} already has a guess for this location!`);
        } else {
            const guess = new Guesses();
            guess.latitude = latitude;
            guess.longitude = longitude;
            guess.distance = this.calculateDistance(+location.latitude, +location.longitude, +latitude, +longitude);
            guess.user = user;
            guess.location = location
            guess.timestamp = new Date();
            guess.locationImage = location.image;

            try {
                await guess.save();
                this.logger.verbose(`User with email: ${user.email} successfully guessed the location with id ${id}!`);
                return guess;
            } catch (error) { return error; }
        }
    }
    
    // Calculate distance between two points
    calculateDistance(lat1: number, long1: number, lat2: number, long2: number): string {
        // Convert degrees to radians
        const toRad = (value: number): number => { return value * Math.PI / 180 }
        const earthRadius = 6371;
        const latDiff = toRad(lat2 - lat1);
        const lonDiff = toRad(long2 - long1);
        const latitude1 = toRad(lat1);
        const latitude2 = toRad(lat2);

        const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) + Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2) * Math.cos(latitude1) * Math.cos(latitude2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;

        return distance.toFixed(4);
    }
}

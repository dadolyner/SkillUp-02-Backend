// Locations Repository
import { EntityRepository, Repository } from 'typeorm';
import { Locations } from '../../entities/locations.entity';
import { LocationParameters } from './dto/location-parameters.dto';
import { Users } from '../../entities/users.entity';
import { Logger, UnauthorizedException } from '@nestjs/common';

@EntityRepository(Locations)
export class LocationRepository extends Repository<Locations> {
    private logger = new Logger('LocationRepository');

    // Create Location
    async createLocation(user: Users, locationParameters: LocationParameters): Promise<Locations> {
        const { latitude, longitude, image } = locationParameters;

        try {
            const location = new Locations();
            location.latitude = latitude;
            location.longitude = longitude;
            location.image = image;
            location.timestamp = new Date();
            location.user = user;

            await location.save()
            this.logger.verbose(`User with email: ${user.email} successfully created a new location at Lat: ${latitude} and Long: ${longitude}!`);
            return location;
        }
        catch (error) {
            throw new UnauthorizedException();
        }
    }

    // Delete Location
    async deleteLocation(user: Users, id: string): Promise<Locations> {
        try {
            const location = await this.findOne(id);
            if (location.userId === user.id) {
                await location.remove();
                this.logger.verbose(`user with email: ${user.email} has successfully deleted location with id: ${id}!`);
                return location;
            } else {
                this.logger.error(`User with email: ${user.email} does not have permission to delete this location!`);
                throw new UnauthorizedException();
            }
        } catch (error) { return error; }
    }

    // Edit location
    async editLocation(user: Users, id: string, locationParameters: LocationParameters): Promise<Locations> {
        const { latitude, longitude, image } = locationParameters;
        const location = await this.findOne(id);

        if (location.userId === user.id) {
            try {
                location.latitude = latitude;
                location.longitude = longitude;
                location.image = image;
                location.timestamp = new Date();
                await location.save();
                this.logger.verbose(`User with email: ${user.email} successfully edited the location with id ${id}!`);
            } catch (error) { return error; }
        } else {
            this.logger.error(`User with email: ${user.email} does not have permission to edit this location!`);
            throw new UnauthorizedException();
        }
    }
}
// Locations Controller
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Locations } from 'src/entities/locations.entity';
import { Users } from 'src/entities/users.entity';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { LocationParameters } from './dto/location-parameters.dto';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
    constructor(private locationService: LocationService ) {  }

    // Get all locations with limit
    @Get()
    async getLocations(@Body('locationsLimit') locationsLimit: number): Promise<Locations[]> {
        return await this.locationService.getLocations(locationsLimit);
    }

    // Get Random Location
    @Get('/random')
    async getRandomLocation(): Promise<Locations> {
        return await this.locationService.getRandomLocation();
    }

    // Create Location
    @UseGuards(AuthGuard())
    @Post()
    async createLocation(@GetUser() user: Users, @Body() locationParameters: LocationParameters): Promise<Locations> {
        return await this.locationService.createLocation(user, locationParameters);
    }

    // Delete Location
    @UseGuards(AuthGuard())
    @Delete('/delete/:id')
    async deleteLocation(@GetUser() user: Users, @Param('id') id: string): Promise<Locations> {
        return await this.locationService.deleteLocation(user, id);
    }
}

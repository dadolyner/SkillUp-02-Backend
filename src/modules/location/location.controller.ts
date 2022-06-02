// Locations Controller
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Guesses } from '../../entities/guesses.entity';
import { Locations } from '../../entities/locations.entity';
import { Users } from '../../entities/users.entity';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { GuessParameters } from './dto/guess-parameters.dto';
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

    // Get location by its id
    @Get('/:id')
    async getLocationById(@Param('id') id: string): Promise<Locations> {
        return await this.locationService.getLocationById(id);
    }

    // Get Random Location
    @Get('/random')
    async getRandomLocation(): Promise<Locations> {
        return await this.locationService.getRandomLocation();
    }

    // Guess Location
    @UseGuards(AuthGuard())
    @Get('/guesses/:id')
    async getGuesses(@Param('id') id: string): Promise<Guesses[]> {
        return await this.locationService.getGuesses(id);
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

    // Edit Location
    @UseGuards(AuthGuard())
    @Patch('/edit/:id')
    async editLocation(@GetUser() user: Users, @Param('id') id: string, @Body() locationParameters: LocationParameters): Promise<Locations> {
        return await this.locationService.editLocation(user, id, locationParameters);
    }

    // Guess Location
    @UseGuards(AuthGuard())
    @Post('/guess/:id')
    async guessLocation(@GetUser() user: Users, @Param('id') id: string, @Body() guessParameters: GuessParameters): Promise<Guesses> {
        return await this.locationService.guessLocation(user, id, guessParameters);
    }
}

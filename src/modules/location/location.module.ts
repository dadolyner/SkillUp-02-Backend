import { LocationService } from './location.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [],
    providers: [
        LocationService,],
})
export class LocationModule { }

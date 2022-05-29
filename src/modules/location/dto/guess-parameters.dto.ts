// Data transfer object for locations
import { IsLatitude, IsLongitude } from 'class-validator';

export class GuessParameters {
    @IsLatitude()
    latitude: string;
    
    @IsLongitude()
    longitude: string;
}

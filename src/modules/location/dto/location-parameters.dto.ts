// Data transfer object for locations
import { IsLatitude, IsLongitude, IsUrl} from 'class-validator';

export class LocationParameters {
    @IsLatitude()
    latitude: string;
    
    @IsLongitude()
    longitude: string;
    
    @IsUrl()
    image: string;
}

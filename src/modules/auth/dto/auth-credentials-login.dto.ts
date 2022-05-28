//Data transfer object for logging in
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthLoginCredentialsDto {
    @IsString()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(255)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password to weak',
    })
    password: string;
}

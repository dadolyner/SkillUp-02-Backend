//Data Transfer Object for signing up
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthSignUpCredentialsDto {
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(30)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(255)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password to weak',
    })
    password: string;
}

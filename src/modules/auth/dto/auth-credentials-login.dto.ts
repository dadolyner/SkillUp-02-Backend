// Data transfer object for logging in
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthLoginCredentialsDto {
    @IsEmail({ message: 'This is not an email!' })
    email: string;

    @IsString({ message: 'Password is not a string!' })
    @MinLength(8, { message: 'Password is too short!' })
    @MaxLength(100 , { message: 'Password is too long!' })
    password: string;
}

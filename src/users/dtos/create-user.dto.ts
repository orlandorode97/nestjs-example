import { IsEmail, IsString } from "class-validator";

// UserDto is a class that lists all the properties needed in the createUser body
export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}    
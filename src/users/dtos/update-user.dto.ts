import { IsEmail, IsString, IsOptional } from "class-validator";

// UserDto is a class that lists all the properties needed in the createUser body
export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    password: string;
}    
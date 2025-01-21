import { IsString, IsEmail, IsStrongPassword, IsOptional, IsDateString, MinLength } from "class-validator";



export class CreateUserDTO {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsDateString()
    birthAt: string; // Valida se está no formato ISO 8601
}



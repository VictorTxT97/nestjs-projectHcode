import { IsString, IsEmail, IsStrongPassword, IsOptional, IsDateString } from "class-validator";



export class CreateUserDTO {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsDateString()
    birthAt: string; // Valida se está no formato ISO 8601
}



import { IsString, IsEmail, IsStrongPassword, IsOptional, IsDateString, MinLength, IsEnum } from "class-validator";
import { Role } from "../../enums/role.enums";




export class CreateUserDTO {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
    @IsOptional()
    @IsDateString()
    birthAt?: string; // Valida se está no formato ISO 8601
    @IsOptional()
    @IsEnum(Role)
    role?: Role; // Valida se é um dos valores do enum
}



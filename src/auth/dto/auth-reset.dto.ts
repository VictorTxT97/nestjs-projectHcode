import {IsJWT, IsString, MinLength} from "class-validator";
export class AuthResetDto {
    
    @IsJWT()
    token: string;
    
    @IsString()
    @MinLength(6)
    password: string;
    
}
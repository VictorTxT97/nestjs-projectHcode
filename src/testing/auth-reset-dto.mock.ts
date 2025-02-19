
import { AuthResetDto } from "../auth/dto/auth-reset.dto";
import { resetToken } from "./reset-token.mock";

export const authResetDTO: AuthResetDto = {
  
  password:'123456',
  token: resetToken
  
};
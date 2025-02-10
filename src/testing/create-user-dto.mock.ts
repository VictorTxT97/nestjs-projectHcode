import { Role } from "../enums/role.enums";
import { CreateUserDTO } from "../user/dto/create-user.dto";

export const creatUserDto:CreateUserDTO ={
        birthAt: '1995-08-14',
        email:'victor.t@example.com',
        name:'Victor Teixeira',
        password:'123456',
        role: Role.ADMIN

        }
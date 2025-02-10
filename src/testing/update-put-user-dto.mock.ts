import { Role } from "../enums/role.enums";
import { UpdatePutUserDTO } from "../user/dto/updte-put-user.dto";

export const updatePutUserDto:UpdatePutUserDTO ={
        birthAt: '1995-08-14',
        email:'victor.t@example.com',
        name:'Victor Teixeira',
        password:'123456',
        role: Role.ADMIN

        }
import { Role } from "../enums/role.enums";
import { UserEntity } from "../user/entity/user.entity";

export const userEntityList: UserEntity[] = [{
    name: "rodrigo alvarenGA",
    email: "RODRIGO.allen@example.com",
    password: "$2b$10$vjPcar4tgrGd20euC5KRvu.ftbrWYUc5J8mVc0uCp/lI6YcCr6SXO",
    birthAt: new Date('1990-07-14'),
    id: 12,
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date()

},{
    name: "serena williys",
    email: "serena@example.com",
    password: "$2b$10$uRVNGgVjQMqeITG1Dvd7Ju8f9D39.hgJZe3h1Qu/RWR.tl3QnrIxe",
    birthAt: new Date('1977-05-18'),
    id: 18,
    role: Role.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date()
},{
    name: "Roblox gay",
    email: "roblox@example.com",
    password: "$2b$10$u3narFiRQ.UpDlzzpCKaY.Bsol4vDiJzuWAjFc7en8jRTZ7dCEEka",
    birthAt: new Date('1955-03-30'),
    id: 17,
    role: Role.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date()
}]

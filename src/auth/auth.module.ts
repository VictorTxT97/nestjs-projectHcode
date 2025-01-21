import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthService } from "./auth.service";
@Module({
    imports: [
        JwtModule.register({
            secret: 'M7LjCDQwUD67QPiw62yN9RVt',
            signOptions: { expiresIn: '7d' },
            
    }),
    UserModule,
    PrismaModule,
],
    controllers: [AuthController],
    providers: [AuthService], // Adiciona AuthService como provider
    exports: [AuthService], // Exporta AuthService, se necessário
})
export class AuthModule {

}
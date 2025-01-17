import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Certifique-se de importar o PrismaModule aqui
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Exporte se for necessário em outros módulos
})
export class UserModule {}

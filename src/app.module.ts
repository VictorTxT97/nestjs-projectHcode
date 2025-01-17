import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module'; // Importação do UserModule

@Module({
  imports: [UserModule], // Adiciona UserModule aqui
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

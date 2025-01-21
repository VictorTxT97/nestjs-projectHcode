import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, AuthModule], // Certifique-se de que os módulos estão listados aqui
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


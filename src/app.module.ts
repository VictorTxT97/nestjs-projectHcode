import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { join } from 'path';


@Module({
  imports: [
    // Importa os módulos do projeto
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // Ethereal não usa SSL
        auth: {
          user: 'margret.lind81@ethereal.email',
          pass: 'qXtAscGNqTcPmBykW5',
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>', // Substitua pelo nome de remetente desejado
      },
      template: {
        dir: join(__dirname, '..', 'src', 'templates'),
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),

  
  ],
  controllers: [AppController],
  providers: [
    AppService,
   
  ],
})
export class AppModule {}



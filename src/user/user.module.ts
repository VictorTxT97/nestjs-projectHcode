import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Importa o JwtModule
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserIdCheckMiddleware } from '../middlewares/user-id-check.middleware';

@Module({
  imports: [
    JwtModule.register({
      secret: 'M7LjCDQwUD67QPiw62yN9RVt', // Use a mesma chave secreta configurada no AuthModule
      signOptions: { expiresIn: '7d' }, // Configuração adicional do JWT (opcional)
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService], // Exporta UserService para outros módulos
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: 'users/:id',
      method: RequestMethod.ALL,
    });
  }
}

import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod,  } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Importa o JwtModule
import { UserController } from './user.controller';
import { UserService } from './user.service';
;
import { UserIdCheckMiddleware } from '../middlewares/user-id-check.middleware';
;
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: 'M7LjCDQwUD67QPiw62yN9RVt', // Use a mesma chave secreta configurada no AuthModule
      signOptions: { expiresIn: '7d' }, // Configuração adicional do JWT (opcional)
    }),
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  
  controllers: [UserController],
  providers: [UserService,],
  exports: [UserService, TypeOrmModule], 
  
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: 'users/:id',
      method: RequestMethod.ALL,
    });
  }
}

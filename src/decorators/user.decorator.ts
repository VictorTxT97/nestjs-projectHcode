import { createParamDecorator, ExecutionContext, NotFoundException } from '@nestjs/common';

export const User = createParamDecorator(
  (data: keyof any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new NotFoundException('Usuário não encontrado. Verifique o token.');
    }

    // Se "data" for fornecido, retorna a propriedade solicitada; caso contrário, retorna o usuário completo
    return data ? request.user[data] : request.user;
  },
);


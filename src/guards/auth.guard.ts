import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        if (err || !user) {
            throw new UnauthorizedException('Unauthorized access: Invalid token or user not found');
        }

        // Popula o usuário no request
        const request = context.switchToHttp().getRequest();
        request.user = user;

        return user;
    }
}

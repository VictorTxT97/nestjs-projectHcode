import { NestMiddleware, BadRequestException} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export class UserIdCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (isNaN(Number(req.params.id)) ||  Number(req.params.id) < 0) {
        throw new BadRequestException('Invalid ID');
    }
    next();
  }
}
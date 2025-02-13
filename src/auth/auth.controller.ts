import {
  Controller,
  Post,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  Req
} from '@nestjs/common';

import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDto } from './dto/auth-forget.dto';
import { AuthResetDto } from './dto/auth-reset.dto';
import { AuthService } from './auth.service';

import { User } from '../decorators/user.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { Express } from 'express';
import { UserService } from '../user/user.service';
import { FileService } from '../file/file.service';
import { UserEntity } from '../user/entity/user.entity';
import { AuthGuard } from '../guards/auth.guard';


@Controller('auth')
export class AuthController {
  constructor(
      private readonly userService: UserService,
      private readonly authService: AuthService,
      private readonly fileService: FileService,
  ) {}

  @Post('login')
  async login(@Body() body: AuthLoginDto) {
      return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
      return this.authService.register(body);
  }

  @Post('forget')
  async forgot(@Body() body: AuthForgetDto) {
      return this.authService.forget(body.email);
  }

  @Post('reset')
  async reset(@Body() body: AuthResetDto) {
      return this.authService.reset(body.password, body.token);
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(
      @User() user: UserEntity, 
      @Req() req: any, // Apenas tipamos como `any` para evitar erro de tipagem
      @Query('field') field?: string
  ) {
      const tokenPayload = req.user; // Pegamos o tokenPayload diretamente
  
      if (field) {
          if (user[field as keyof UserEntity]) {
              return { 
                  field: { [field]: user[field as keyof UserEntity] }, 
                  tokenPayload,
                  request: { url: req.url, method: req.method } 
              };
          } else {
              return { 
                  error: `Propriedade '${field}' não encontrada no usuário`, 
                  tokenPayload,
                  request: { url: req.url, method: req.method } 
              };
          }
      }
  
      return { user, tokenPayload, request: { url: req.url, method: req.method } };
  }

  @Post('photo')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
          throw new BadRequestException('Arquivo não encontrado');
      }

      const filePath = join(__dirname, '../../storage', file.originalname);
      try {
          await this.fileService.upload(file, filePath);
      } catch (e) {
          if (e instanceof Error) {
              throw new BadRequestException(e.message);
          } else {
              throw new BadRequestException('Erro inesperado');
          }
      }
      return await this.fileService.upload(file, filePath);
  }
}

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
    FileTypeValidator
  } from '@nestjs/common';
  import { AuthLoginDto } from './dto/auth-login.dto';
  import { AuthRegisterDTO } from './dto/auth-register.dto';
  import { AuthForgetDto } from './dto/auth-forget.dto';
  import { AuthResetDto } from './dto/auth-reset.dto';
  import { AuthService } from './auth.service';
  import { UserService } from 'src/user/user.service';
  import { AuthGuard } from 'src/guards/auth.guard';
  import { User } from '../decorators/user.decorator';
  import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
  import { join } from 'path';
  import { Express } from 'express'; // Tipo correto para arquivos enviados
  import { FileService } from 'src/file/file.service';
  import {Multer} from 'multer'
  import { diskStorage } from'multer';
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
    async me(@User() user, @Query('field') field?: string) {
      if (field) {
        if (user[field]) {
          return { [field]: user[field] }; // Retorna apenas a propriedade solicitada
        } else {
          return { error: `Property '${field}' not found on user` }; // Propriedade inválida
        }
      }
      return { user }; // Retorna o usuário completo
    }
  
    @Post('photo')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new BadRequestException('Arquivo não encontrado');
      }
  
      // Caminho absoluto para salvar o arquivo
      const filePath = join(__dirname, '../../storage', file.originalname);
      try{
        await this.fileService.upload(file, filePath);  
      }catch(e){
        throw new BadRequestException(e.message)
      }
     
  
      // Salva o arquivo
      return await this.fileService.upload(file, filePath);
    }
    @Post('files')
@UseGuards(AuthGuard)
@UseInterceptors(FilesInterceptor('file'))
async uploadFiles(
    @UploadedFiles(
        new ParseFilePipe({
            validators: [new FileTypeValidator({ fileType: 'image/png' })],
        }),
    )
    files: Express.Multer.File[],
) {
    if (!files || files.length === 0) {
        throw new BadRequestException('Nenhum arquivo encontrado');
    }

    try {
        for (const file of files) {
            const filePath = join(__dirname, '../../storage', file.originalname);
            await this.fileService.upload(file, filePath);
        }
        return { message: 'Arquivos enviados com sucesso', files: files.map(file => file.originalname) };
    } catch (e) {
        throw new BadRequestException(e.message);
    }
}
@Post('reset')
async resetPassword(
  @Body('password') password: string,
  @Body('token') token: string,
) {
  return this.authService.reset(password, token);
}

  
  }
  
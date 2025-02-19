import {
  Controller,
  Post,
  Body,
  Get, 
  Put,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UseInterceptors,
  UseGuards,
  
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enums';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/role.guard';
import { LogInterceptor } from '../interceptors/log.interceptor';
import { ParamId } from '../decorators/param-is.decorator';

@Roles(Role.ADMIN)
@UseGuards( AuthGuard, RolesGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // CREATE
  
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateUserDTO) {
    try {
      const user = await this.userService.create(body);
      return user;
    } catch (error) {
      throw new BadRequestException((error as Error).message);

    }
  }

  // LIST ALL
  
  @Get()
  async list() {
    return await this.userService.list();
  }

  // SHOW (FIND BY ID)
  
  @Get(':id')
  async show(@ParamId() id: number) {
    const user = await this.userService.show(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  // UPDATE (PUT)
  
  @Put(':id')
  async update(@ParamId() id: number, @Body() body: CreateUserDTO) {
    try {
      const updatedUser = await this.userService.update(id, body);
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      return updatedUser;
    } catch (error) {
      throw new BadRequestException((error as Error).message);

    }
  }

  // PARTIAL UPDATE (PATCH)
  
  @Patch(':id')
  async updatePartial(@ParamId() id: number, @Body() body: UpdatePatchUserDTO) {
    try {
      const updatedUser = await this.userService.updatePartial(id, body);
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      return updatedUser;
    } catch (error) {
      throw new BadRequestException((error as Error).message);

    }
  }

  // DELETE
  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@ParamId() id: number) {
    try {
      const result = await this.userService.delete(id);
      return result; // Retornará vazio devido ao HTTP 204
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
  }
}

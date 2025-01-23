import {
  Controller,
  Post,
  Body,
  Get,
  Param,
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
import { ParamId } from 'src/decorators/param-is.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enums';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { RolesGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // CREATE
  
  @Roles(Role.Admin)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateUserDTO) {
    try {
      const user = await this.userService.create(body);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // LIST ALL
  @Roles(Role.Admin)
  @Get()
  async list() {
    return await this.userService.list();
  }

  // SHOW (FIND BY ID)
  @Roles(Role.Admin)
  @Get(':id')
  async show(@ParamId() id: number) {
    const user = await this.userService.show(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  // UPDATE (PUT)
  @Roles(Role.Admin)
  @Put(':id')
  async update(@ParamId() id: number, @Body() body: CreateUserDTO) {
    try {
      const updatedUser = await this.userService.update(id, body);
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // PARTIAL UPDATE (PATCH)
  @Roles(Role.Admin)
  @Patch(':id')
  async updatePartial(@ParamId() id: number, @Body() body: UpdatePatchUserDTO) {
    try {
      const updatedUser = await this.userService.updatePartial(id, body);
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // DELETE
  @Roles(Role.Admin)
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

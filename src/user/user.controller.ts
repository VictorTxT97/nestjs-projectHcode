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
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { CreateUserDTO } from './dto/create-user.dto';
  import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
  
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
        throw new BadRequestException(error.message);
      }
    }
  
    // LIST ALL
    @Get()
    async list() {
      return await this.userService.list();
    }
  
    // SHOW (FIND BY ID)
    @Get(':id')
    async show(@Param('id') id: string) {
      const user = await this.userService.show(Number(id));
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      return user;
    }
  
    // UPDATE (PUT)
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: CreateUserDTO) {
      try {
        const updatedUser = await this.userService.update(Number(id), body);
        if (!updatedUser) {
          throw new NotFoundException(`User with ID ${id} not found.`);
        }
        return updatedUser;
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }
  
    // PARTIAL UPDATE (PATCH)
    @Patch(':id')
    async updatePartial(
      @Param('id') id: string,
      @Body() body: UpdatePatchUserDTO,
    ) {
      try {
        const updatedUser = await this.userService.updatePartial(Number(id), body);
        if (!updatedUser) {
          throw new NotFoundException(`User with ID ${id} not found.`);
        }
        return updatedUser;
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }
  
    // DELETE
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string) {
      try {
        const result = await this.userService.delete(Number(id));
        return result; // Retornará vazio devido ao HTTP 204
      } catch (error) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
    }
  }
  
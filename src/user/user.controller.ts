import { Controller, Post, Body, Get, Param, Put, Patch, Delete } from '@nestjs/common';


@Controller('users')
export class UserController {

@Post()
async create(@Body() body){
    return {body};
}

@Get()
async list(){
    return {users: []};
}

@Get(':id')
async show(@Param() params){
    return {users: []};
}

@Put(':id')
async update(@Body() body, @Param() params){
    return {body, params, method: 'PUT'};

}

@Patch(':id')
async updatePartial(@Body() body, @Param() params){
    return {body, params, method: 'patch'};
}

@Delete()
async delete(@Param() params){
    return {params, method: 'delete'};
}


}
import { Body, Controller, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';


import { UserService } from '@/modules/user/services/user.service';
import { User } from '@/core/models';
import { CreateUserDto, UpdateUserDto } from '@/modules/user/data/user/dto';
import { SwaggerDecoratorCreateUser, SwaggerDecoratorUpdateUser } from '@/modules/user/data/user/swagger';


@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,

    ) {}
 @SwaggerDecoratorCreateUser()
 @Post()
 create(@Body() body: CreateUserDto): Promise<User> {
        return  this.userService.createUser(body)
    }

  @SwaggerDecoratorUpdateUser()
  @Patch('/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto): Promise<User>  {
   return  this.userService.updateUser(id, body)
}





}
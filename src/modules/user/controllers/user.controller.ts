import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseFilePipeBuilder,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '@/modules/user/services/user.service';
import { User } from '@/core/models';
import { CreateUserDto, UpdateUserDto } from '@/modules/user/data/user/dto';
import { SwaggerDecoratorCreateUser, SwaggerDecoratorUpdateUser } from '@/modules/user/data/user/swagger';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';
import { JwtAuthGuard } from '@/core/guard/jwt-auth.guard';
import { CurrentUser } from '@/decorator/current-user.decorator';
import { SwaggerDecoratorGetUser } from '@/modules/user/data/user/swagger/get-user.swagger.decorator';
import { SwaggerDecoratorGetAvatar } from '@/modules/user/data/user/swagger/get-avatart.swagger.decorator';
import { MEDIA_TYPES_REGEX } from '@/utils/data/const';
import { MAX_FILE_SIZE_BYTES, ONE_MB_IN_BYTES } from '@/utils/data/const/constants';
import { GetAvatarQuery } from '@/modules/user/data/user/query';
import { CombinedUserDto } from '@/modules/user/data/user/dto/combined-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,




    ) {}
 @SwaggerDecoratorCreateUser()
 @UseGuards(JwtAuthGuard)
 @Post()
 create(@Body() body: CreateUserDto): Promise<User> {
        return  this.userService.createUser(body)
    }

  @SwaggerDecoratorUpdateUser()
  @UseGuards(JwtAuthGuard)
  @Patch()
  update( @Body() body: UpdateUserDto): Promise<ResponseMessageDto>  {
   return  this.userService.changeUser(body)
}

    @SwaggerDecoratorUpdateUser()
    @UseGuards(JwtAuthGuard)
    @Delete()
    deleteUser( @CurrentUser('id') userId: string): Promise<ResponseMessageDto>  {
        return  this.userService.deleteUser(+userId)
    }

    @SwaggerDecoratorUpdateUser()
    @UseGuards(JwtAuthGuard)
    @Patch('update-local')
    updateLocalUserData( @CurrentUser('id') userId: string, @Body() body: UpdateUserDto): Promise<ResponseMessageDto>  {
        return  this.userService.updateUser(+userId,body)
    }

    @SwaggerDecoratorGetUser()
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getUser( @CurrentUser('id') userId: string): Promise<CombinedUserDto>   {
       return  this.userService.getMe(+userId)
    }

    @SwaggerDecoratorGetUser()
    @UseGuards(JwtAuthGuard)
    @Delete('update-avatar/:userId')
    deleteUserAvatar(@Param('userId', ParseIntPipe) userId: number): Promise<ResponseMessageDto>  {
        return  this.userService.deleteAvatar(userId)
    }



@SwaggerDecoratorGetAvatar()
@UseGuards(JwtAuthGuard)
@Get('avatar')
 async   getAvatar(@Query() query: GetAvatarQuery, @Res() res: Response) {
    const file = await this.userService.getAvatar(query)
    res.set({
        'Content-Type': 'image/jpeg',
        
    });

    res.send(file);
}

    @UseInterceptors(FileInterceptor('avatar'))
    @Patch('update-avatar/:userId')
    updateAvatar(

        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({ fileType: MEDIA_TYPES_REGEX })
                .addMaxSizeValidator({
                    maxSize: MAX_FILE_SIZE_BYTES,
                    message: (maxSize) =>
                        `File size should be less than ${maxSize / ONE_MB_IN_BYTES} MB`,
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    fileIsRequired: false,
                }),
        )
        file: Express.Multer.File,
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<ResponseMessageDto> {
     
        console.log('FILE =>', file);
        return this.userService.uploadAvatar(userId, file);
    }

}
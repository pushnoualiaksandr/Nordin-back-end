import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '@/modules/user/data/user/dto/create-user.dto';


export class UpdateUserDto extends PartialType(CreateUserDto) {}
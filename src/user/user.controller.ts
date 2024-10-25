import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  create(@Body(ValidationPipe) createUserDto: createUserDto) {
    return this.userService.create(createUserDto);
  }
}

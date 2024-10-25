import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

import { createUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    return this.databaseService.user.findMany();
  }
  async create(createUserDto: createUserDto) {
    return this.databaseService.user.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        password: createUserDto.password,
      },
    });
  }
  async findOne(id: string) {
    return this.databaseService.user.findUnique({
      where: { id },
    });
  }
}

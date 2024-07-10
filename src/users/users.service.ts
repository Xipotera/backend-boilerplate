import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '../utils/bcrypt.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async register(user: Partial<CreateUserDto>): Promise<User> {
    const newUser = new User();
    newUser.email = user.email;
    newUser.password = await hashPassword(user.password);
    newUser.firstname = user.firstname;
    newUser.lastname = user.lastname;

    return this.usersRepository.save(newUser);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '../utils/bcrypt.util';
import { EmailTokenVerificationEntity } from '../token/emailTokenVerification.entity';
import { getRandomIntInclusive } from '../utils/random';
import { RegisterResponse } from './dto/register-response.dto';
import { omit } from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(EmailTokenVerificationEntity)
    private emailTokenVerificationRepository: Repository<EmailTokenVerificationEntity>,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async register(
    registerUser: Partial<CreateUserDto>,
  ): Promise<Partial<RegisterResponse>> {
    const newUser = new User();
    newUser.email = registerUser.email;
    newUser.password = await hashPassword(registerUser.password);
    newUser.firstname = registerUser.firstname;
    newUser.lastname = registerUser.lastname;

    const emailTokenVerification = new EmailTokenVerificationEntity();
    emailTokenVerification.email = newUser.email;
    emailTokenVerification.token = getRandomIntInclusive(100000, 900000);

    const user = await this.usersRepository.save(newUser);
    const token = await this.emailTokenVerificationRepository.save(
      emailTokenVerification,
    );

    return {
      ...omit(user, ['password']),
      ...token,
    };
  }

  async getUserFromToken(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }
}

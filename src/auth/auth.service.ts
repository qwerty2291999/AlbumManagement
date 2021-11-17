/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '../errors/errors';
import { Repository } from 'typeorm';
import { CreateUser } from './dto/create-user.dto';
import { User } from '../user/user.entity';
import { encode, decode } from '../../libs/bcrypt';
import { MailService } from '../../src/mail/mail.service';
import { decodeJwt, encodeJwt } from '../../libs/jwt';
import { RegisterSuccessMessage } from './interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailService: MailService,
  ) {}
  async register(createUser: CreateUser): Promise<any> {
    const user = new User();
    user.name = createUser.name;
    user.userName = createUser.userName;
    user.password = await encode(createUser.password);
    user.email = createUser.email;
    const newUser = this.usersRepository.create(user);
    await this.usersRepository
      .save(newUser)
      .then((result) => {
        if (result) {
          return result;
        }
        throw new ConflictException();
      })
      .catch(() => {
        throw new ConflictException();
      });
    this.mailService.send(user.email);
    return { message: 'An email has been sent' };
  }
  async validateUser(username, pass): Promise<object> {
    const stringToArr = username.split('');
    const checkUorE = stringToArr.filter((str) => str === '@');
    if (checkUorE[0] == undefined) {
      const find = await this.usersRepository
        .findOne({ userName: username })
        .then((result) => {
          if (result) {
            return result;
          }
          throw new HttpException('Wrong UserName or password', 401);
        })
        .catch((e) => {
          throw e;
        });
      await decode(pass, find.password);
      const { password, ...result } = find;
      return result;
    }
    const find = await this.usersRepository
      .findOne({ email: username })
      .then((result) => {
        if (result) {
          return result;
        }
        throw new HttpException('Wrong Email or password', 401);
      })
      .catch((e) => {
        throw e;
      });
    await decode(pass, find.password);
    const { password, ...result } = find;
    return result;
  }
  async login(user: any): Promise<object> {
    const payload = { email: user.email, userId: user.id, status: user.status };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async verify(email: string): Promise<any> {
    const result = await decodeJwt(email);
    await this.usersRepository.update(
      { email: result.email },
      { status: true },
    );
    const message: RegisterSuccessMessage = {
      message: 'Verified Your Account',
    };
    return message;
  }
}

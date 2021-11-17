import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { decode, encode } from '../../libs/bcrypt';
import { Repository } from 'typeorm';
import { UpdateInfo } from './dto/update-info.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async me(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      relations: ['albums'],
      where: { id },
    });
  }
  async changePassword(
    uid: number,
    pass: string,
    new_pass: string,
  ): Promise<User> {
    const getUser = await this.usersRepository.findOne(uid);
    await decode(pass, getUser.password);
    getUser.password = await encode(new_pass);
    getUser.updatedAt = new Date();
    await this.usersRepository.update({ id: uid }, getUser);
    return getUser;
  }
  async updateInfo(uid: number, updateInfo: UpdateInfo): Promise<User> {
    const getUser = await this.usersRepository.findOne(uid);
    const newInfo = Object.assign(getUser, updateInfo);
    getUser.updatedAt = new Date();
    await this.usersRepository.update({ id: uid }, newInfo);
    return newInfo;
  }
}

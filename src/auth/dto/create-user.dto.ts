/* eslint-disable prettier/prettier */
import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUser {
  @ApiProperty()
  @IsNotEmpty({ message: 'Khong duoc de trong username' })
  @Length(3, 255)
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Khong duoc de trong username' })
  @Length(3, 255)
  userName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Khong duoc de trong password' })
  @Length(3, 255)
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Khong duoc de trong email' })
  @Length(3, 255)
  email: string;
}

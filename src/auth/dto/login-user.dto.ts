/* eslint-disable prettier/prettier */
import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginUser {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 255)
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 255)
  password: string;
}

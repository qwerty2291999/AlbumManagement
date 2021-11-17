/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { Match } from '../custom-validator/match';

export class ChangePassword {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 255)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 255)
  new_password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Match('new_password')
  @Length(3, 255)
  rep_new_password: string;
}

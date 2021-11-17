/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';

export class UpdateInfo {
  @ApiProperty()
  @Length(3, 255)
  @IsOptional()
  name: string;

  @ApiProperty()
  @Length(3, 255)
  @IsOptional()
  userName: string;
}

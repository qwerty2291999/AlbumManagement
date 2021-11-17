/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Transfer {
  @ApiProperty()
  @IsNotEmpty()
  send: number;
  @ApiProperty()
  @IsNotEmpty()
  get: number;
}

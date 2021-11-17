/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetUser {
  @ApiProperty()
  @IsNotEmpty()
  id: number;
}

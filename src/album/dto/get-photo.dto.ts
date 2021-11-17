/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetPhoto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;
}

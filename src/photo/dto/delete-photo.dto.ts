/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeletePhoto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;
}

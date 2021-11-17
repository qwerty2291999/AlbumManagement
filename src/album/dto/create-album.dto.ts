/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class CreateAlbum {
  @ApiProperty()
  @Length(3, 255)
  name: string;

  user: number;

  @ApiProperty()
  @Length(3, 255)
  description: string;
}

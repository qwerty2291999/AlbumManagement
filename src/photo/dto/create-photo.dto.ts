/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl, Length } from 'class-validator';

export class CreatePhoto {
  @ApiProperty()
  @Length(3, 255)
  name: string;

  userId: number;

  @ApiProperty()
  @IsOptional()
  albumId: number;

  @ApiProperty()
  @IsUrl()
  @Length(3, 255)
  link: string;
}

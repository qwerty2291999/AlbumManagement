/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize } from 'class-validator';

export class DeleteAlbumPhotos {
  @ApiProperty({ type: [Number] })
  @ArrayMinSize(1)
  photoId: number[];
}

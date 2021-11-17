import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from '../../src/album/album.entity';
import { User } from '../../src/user/user.entity';
import { PhotoController } from './photo.controller';
import { Photo } from './photo.entity';
import { PhotoService } from './photo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Photo, Album, User])],
  exports: [TypeOrmModule, PhotoService],
  providers: [PhotoService],
  controllers: [PhotoController],
})
export class PhotoModule {}

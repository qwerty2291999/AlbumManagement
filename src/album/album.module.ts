import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from '../../src/photo/photo.entity';
import { User } from '../../src/user/user.entity';
import { AlbumTransfer } from './album-transfer.entity';
import { AlbumController } from './album.controller';
import { Album } from './album.entity';
import { AlbumService } from './album.service';

@Module({
  imports: [TypeOrmModule.forFeature([Album, User, Photo, AlbumTransfer])],
  exports: [TypeOrmModule, AlbumService],
  providers: [AlbumService],
  controllers: [AlbumController],
})
export class AlbumModule {}

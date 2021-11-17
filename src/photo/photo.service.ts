/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from '../../src/album/album.entity';
import { User } from '../../src/user/user.entity';
import { Repository } from 'typeorm';
import { CreatePhoto } from './dto/create-photo.dto';
import { UpdatePhoto } from './dto/update-photo.dto';
import { Photo } from './photo.entity';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async deletePhoto(uid: number, id: number): Promise<any> {
    return this.photoRepository
      .findOne(id)
      .then((result) => {
        if (!result) {
          throw new HttpException('Not Found', 404);
        }
        if (result.userId !== uid) {
          throw new HttpException('Not The Owner', 403);
        }
        return this.photoRepository.delete(result.id);
      })
      .catch((e) => {
        throw new HttpException({ message: e.message }, e.status);
      });
  }
  async updatePhoto(
    id: number,
    uid: number,
    updatePhoto: UpdatePhoto,
  ): Promise<Photo> {
    return this.photoRepository
      .findOne(id)
      .then(async (r) => {
        if (!r) {
          throw new HttpException('Not Found', 404);
        }
        if (r.userId !== uid) {
          throw new HttpException('Not the owner', 403);
        }
        const newData = Object.assign(r, updatePhoto);
        newData.updatedAt = new Date();
        await this.photoRepository.update(id, newData);
        return newData;
      })
      .catch((e) => {
        throw new HttpException({ message: e.message }, e.status);
      });
  }
  async createPhoto(uid: number, createPhoto: CreatePhoto): Promise<Photo> {
    const album = new Album();
    const photo = new Photo();
    album.id = createPhoto.albumId;
    photo.name = createPhoto.name;
    photo.link = createPhoto.link;
    photo.userId = uid;
    album.photos = [photo];
    return this.photoRepository
      .save(photo)
      .then((r) => {
        if (r) {
          return r;
        }
      })
      .catch((e) => {
        throw new HttpException({ message: e.message }, e.status);
      });
  }
  async getOwn(): Promise<Photo[]> {
    return this.photoRepository.find({ relations: ['albums'] });
  }
  async getOne(id: number): Promise<Photo> {
    return this.photoRepository
      .findOne(id)
      .then((r) => {
        if (r) return r;
        throw new HttpException('Not Found', 404);
      })
      .catch((e) => {
        throw new HttpException({ message: e.message }, e.status);
      });
  }
}

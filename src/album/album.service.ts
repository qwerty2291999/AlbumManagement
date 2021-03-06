/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from '../../src/photo/photo.entity';
import { User } from '../../src/user/user.entity';
import { Repository } from 'typeorm';
import { Album } from './album.entity';
import { CreateAlbum } from './dto/create-album.dto';
import { Transfer } from './dto/transfer.dto';
import { AddUser, Message } from './interface';
import { DeleteAlbumPhotos } from './dto/delete-album-photos';
import { AlbumTransfer, STATUS } from './album-transfer.entity';
import { TransferAction } from './dto/transfer-action.dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
    @InjectRepository(AlbumTransfer)
    private albumTransferRepository: Repository<AlbumTransfer>,
  ) {}
  async createAlbum(id: number, createAlbum: CreateAlbum): Promise<Album> {
    const album = new Album();
    const user = await this.userRepository.findOne({
      relations: ['albums'],
      where: { id },
    });
    album.name = createAlbum.name;
    album.description = createAlbum.description;
    album.userId = user.id;
    const newAlbum = await this.albumRepository
      .save(album)
      .then((r) => {
        if (r) {
          return r;
        }
      })
      .catch((e) => {
        console.log(e);
        throw new HttpException({ message: e.message }, 400);
      });
    user.albums.push(newAlbum);
    await this.userRepository.save(user);
    return newAlbum;
  }
  async getAlbum(): Promise<Album[]> {
    return this.albumRepository.find({
      relations: ['photos', 'users'],
    });
  }
  async deleteUser(addUser: AddUser): Promise<Album> {
    const user = await this.userRepository
      .findOne({
        relations: ['albums'],
        where: { id: addUser.uid },
      })
      .then((r) => {
        if (r) {
          return r;
        }
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      });
    const a = user.albums.filter((album) => {
      return album.id == addUser.id;
    });
    if (!a[0]) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (a[0].userId !== addUser.owner) {
      throw new HttpException('You are not the owner', HttpStatus.FORBIDDEN);
    }
    user.albums = user.albums.filter((album) => {
      return album.id !== addUser.id;
    });
    await this.userRepository.save(user);
    return this.albumRepository.findOne(addUser.id);
  }
  async deleteAlbum(uid: number, id: number): Promise<any> {
    await this.albumRepository
      .findOne(id)
      .then((r) => {
        if (r) {
          if (r.userId !== uid) {
            throw new HttpException('Not the owner', 403);
          }
          return r;
        }
      })
      .catch((e) => {
        throw new HttpException({ message: e.message }, e.status);
      });
    return this.albumRepository
      .delete(id)
      .then((r) => {
        if (r) {
          return r;
        }
      })
      .catch((e) => {
        throw new HttpException({ message: e.message }, e.status);
      });
  }
  async addUser(addUser: AddUser): Promise<any> {
    await this.albumRepository
      .findOne({ relations: ['users'], where: { id: addUser.id } })
      .then((r) => {
        if (r) {
          const arr: number[] = [];
          for (let i = 0; i < r.users.length; i++) {
            if (r.users[i].id === addUser.owner) {
              arr.push(r.users[i].id);
              break;
            }
          }
          if (!arr[0]) {
            throw new HttpException(
              'Dont have permision',
              HttpStatus.FORBIDDEN,
            );
          }
        }
      });
    const user = await this.userRepository
      .findOne({
        relations: ['albums'],
        where: { id: addUser.uid },
      })
      .then((r) => {
        if (r) {
          r.albums.map((album) => {
            if (album.id == addUser.id) {
              throw new HttpException(
                'This user is already join this album',
                400,
              );
            }
          });
          return r;
        }
        throw new HttpException('Not Found User', 404);
      })
      .catch((e) => {
        throw new HttpException({ message: e.message }, e.status);
      });
    const album = await this.albumRepository
      .findOne({
        where: { id: addUser.id },
      })
      .then((r) => {
        if (r) {
          return r;
        }
        throw new HttpException('Not Found Album', 404);
      })
      .catch((e) => {
        throw new HttpException({ message: e.message }, e.status);
      });
    user.albums.push(album);
    return this.userRepository.save(user);
  }
  async addPhoto(id: number, pid: number): Promise<any> {
    const photo = await this.photoRepository
      .findOne(pid)
      .then((r) => {
        if (r) {
          return r;
        }
        throw new HttpException('Not Found Photo', 404);
      })
      .catch((e) => {
        throw new HttpException({ message: e.message }, e.status);
      });
    const album = await this.albumRepository
      .findOne({
        relations: ['photos'],
        where: { id },
      })
      .then((r) => {
        if (r) {
          r.photos.map((photo) => {
            if (photo.id == pid) {
              throw new HttpException('Photo is already in', 400);
            }
          });
          return r;
        }
        throw new HttpException('Not Found Album', 404);
      })
      .catch((e) => {
        throw new HttpException({ message: e.message }, e.status);
      });
    album.photos.push(photo);
    return this.albumRepository.save(album);
  }
  async getOneAlbum(id: number): Promise<Album> {
    return this.albumRepository
      .findOne({
        where: { id: id },
        relations: ['photos'],
      })
      .then((r) => {
        if (r) {
          return r;
        }
        throw new HttpException('Not Found', 404);
      })
      .catch((e) => {
        throw new HttpException({ message: e.message }, e.status);
      });
  }
  async transfer(transfer: Transfer): Promise<any> {
    const send = await this.albumRepository.findOne({
      relations: ['photos'],
      where: { id: transfer.send },
    });
    const get = await this.albumRepository.findOne({
      relations: ['photos'],
      where: { id: transfer.get },
    });
    if (send.userId === get.userId) {
      const newGet = get.photos.concat(send.photos);
      send.photos = [];
      get.photos = newGet;
      await this.albumRepository.save(send);
      return await this.albumRepository.save(get);
    }
    const requestData = new AlbumTransfer();
    requestData.sendUserId = send.userId;
    requestData.getUserId = get.userId;
    requestData.sendId = send.id;
    requestData.getId = get.id;
    await this.albumTransferRepository
      .findOne({
        where: { sendId: requestData.sendId, getId: requestData.getId },
      })
      .then((r) => {
        if (r) {
          throw new HttpException(
            { message: 'Transfer is already requested' },
            400,
          );
        }
      })
      .catch((e) => {
        throw new HttpException({ message: e.message }, e.status);
      });
    await this.albumTransferRepository.save(requestData);
    const message: Message = {
      message: `Created Transfer Request From ${requestData.sendId} to ${requestData.getId}`,
    };
    return message;
  }
  async deletePhoto(
    uid: number,
    id: number,
    deletePhoto: DeleteAlbumPhotos,
  ): Promise<Album> {
    const album = await this.albumRepository
      .findOne({
        relations: ['photos', 'users'],
        where: { id: id },
      })
      .then((r) => {
        if (r) {
          return r;
        }
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      });
    const user = [];
    for (let i = 0; i < album.users.length; i++) {
      if (album.users[i].id === uid) {
        user.push(album.users[i].id);
      }
    }
    if (user[0] !== uid) {
      throw new HttpException('No Permission', HttpStatus.FORBIDDEN);
    }
    album.photos = album.photos.filter((p) => {
      if (!deletePhoto.photoId.includes(p.id)) {
        return p.id;
      }
    });
    const { users, ...newAlbum } = album;
    return await this.albumRepository.save(newAlbum);
  }
  async getTransferRequests(uid: number): Promise<AlbumTransfer[]> {
    return this.albumTransferRepository.find({ where: { sendUserId: uid } });
  }
  async getTransferReceives(uid: number): Promise<AlbumTransfer[]> {
    return this.albumTransferRepository.find({ where: { getUserId: uid } });
  }
  async getTransferReceivesActions(obj: TransferAction): Promise<any> {
    const request = await this.albumTransferRepository
      .findOne({
        where: { id: obj.requestId, getUserId: obj.uid },
      })
      .then((r) => {
        if (r) {
          return r;
        }
        throw new HttpException('Not Found Transfer Request', 404);
      })
      .catch((e) => {
        throw new HttpException({ message: e.message }, e.status);
      });
    const send = await this.albumRepository.findOne({
      relations: ['photos'],
      where: { id: request.sendId },
    });
    const get = await this.albumRepository.findOne({
      relations: ['photos'],
      where: { id: request.getId },
    });
    if (get.userId !== obj.uid) {
      throw new HttpException('You are not the OWNER', 403);
    }
    if (obj.status === STATUS.ACCEPTED) {
      const newGet = get.photos.concat(send.photos);
      send.photos = [];
      get.photos = newGet;
      await this.albumRepository.save(send);
      request.status = STATUS.ACCEPTED;
      await this.albumTransferRepository.save(request);
      get.updatedAt = new Date();
      return await this.albumRepository.save(get);
    }
    const message: Message = { message: 'Rejected the request' };
    request.status = STATUS.REJECTED;
    await this.albumTransferRepository.save(request);
    return message;
  }
}

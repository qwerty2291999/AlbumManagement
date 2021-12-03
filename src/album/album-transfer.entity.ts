/* eslint-disable prettier/prettier */
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Album } from './album.entity';
export enum STATUS {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PENDING = 'pending',
}
@Entity()
export class AlbumTransfer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'sendUserId' })
  @Column()
  sendUserId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'getUserId' })
  @Column()
  getUserId: number;

  @ManyToOne(() => Album, (album) => album.id)
  @JoinColumn({ name: 'sendId' })
  @Column()
  sendId: number;

  @ManyToOne(() => Album, (album) => album.id)
  @JoinColumn({ name: 'getId' })
  @Column()
  getId: number;

  @Column({ type: 'enum', enum: STATUS, default: STATUS.PENDING })
  status: STATUS;
}

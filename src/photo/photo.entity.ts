/* eslint-disable prettier/prettier */
import { Album } from '../../src/album/album.entity';
import { User } from '../../src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: number;

  @ManyToMany(() => Album, (album) => album.photos, { onDelete: 'CASCADE' })
  @JoinTable()
  albums: Album[];

  @Column()
  userId: number;

  @Column()
  link: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: null })
  updatedAt: Date;

  @Column({ default: true })
  status: boolean;
}

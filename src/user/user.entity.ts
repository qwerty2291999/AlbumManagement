/* eslint-disable prettier/prettier */
import { Album } from '../../src/album/album.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @ManyToMany(() => Album, (album) => album.users)
  @JoinTable()
  albums: Album[];

  @Column({ unique: true })
  email: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: null })
  updatedAt: Date;

  @Column({ default: false })
  status: boolean;
}

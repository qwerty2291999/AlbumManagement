/* eslint-disable prettier/prettier */
import { Photo } from '../../src/photo/photo.entity';
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
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinTable()
  users: User[];

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: number;

  @Column()
  userId: number;

  @ManyToMany(() => Photo, (photo) => photo.albums)
  @JoinTable()
  photos: Photo[];

  @Column()
  description: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: null })
  updatedAt: Date;

  @Column({ default: false })
  status: boolean;
}

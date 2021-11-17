import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PhotoController } from './photo/photo.controller';
import { AlbumController } from './album/album.controller';
import { AlbumModule } from './album/album.module';
import { PhotoModule } from './photo/photo.module';
import { Connection } from 'typeorm';
import { User } from './user/user.entity';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { VerifyMiddleware } from './middleware/verify.middleware';
import { Photo } from './photo/photo.entity';
import { Album } from './album/album.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      keepConnectionAlive: true,
      entities: [User, Photo, Album],
    }),
    UserModule,
    AlbumModule,
    PhotoModule,
    AuthModule,
    MailModule,
  ],
  controllers: [
    AppController,
    UserController,
    PhotoController,
    AlbumController,
    AuthController,
  ],
  providers: [AppService, UserService, AuthService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(VerifyMiddleware).forRoutes('user');
  //   consumer.apply(VerifyMiddleware).forRoutes('photo');
  //   consumer.apply(VerifyMiddleware).forRoutes('album');
  // }
}

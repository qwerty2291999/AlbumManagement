import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteAlbumPhotos } from './dto/delete-album-photos';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { Album } from './album.entity';
import { AlbumService } from './album.service';
import { CreateAlbum } from './dto/create-album.dto';
import { GetOneAlbum } from './dto/get-one-album.dto';
import { GetPhoto } from './dto/get-photo.dto';
import { GetUser } from './dto/get-user.dto';
import { Transfer } from './dto/transfer.dto';
import { AddUser } from './interface';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}
  @UseGuards(JwtAuthGuard)
  @Post('create-album')
  @ApiTags('Album')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Album' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Unknow.' })
  createAlbum(
    @Request() req,
    @Body() createAlbum: CreateAlbum,
  ): Promise<Album> {
    return this.albumService.createAlbum(req.user.userId, createAlbum);
  }
  @ApiTags('Album')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All Albums' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getAlbum(): Promise<any> {
    return this.albumService.getAlbum();
  }
  @ApiTags('Album')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Single Album' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getOneAlbum(@Param('id') id: number): Promise<Album> {
    return this.albumService.getOneAlbum(id);
  }
  @ApiTags('Album')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete User from Album' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found User Or album.' })
  @UseGuards(JwtAuthGuard)
  @Delete('delete-user/:id')
  deleteUser(
    @Request() req,
    @Param('id') id: number,
    @Body() getUser: GetUser,
  ): Promise<Album> {
    const data: AddUser = { owner: req.user.userId, id, uid: getUser.id };
    return this.albumService.deleteUser(data);
  }
  @ApiTags('Album')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Album' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @UseGuards(JwtAuthGuard)
  @Delete('delete-album')
  deleteAlbum(
    @Request() req,
    @Body() getOneAlbum: GetOneAlbum,
  ): Promise<Album> {
    return this.albumService.deleteAlbum(req.user.userId, getOneAlbum.id);
  }
  @ApiTags('Album')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add User from Album' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found User Or album.' })
  @ApiResponse({ status: 400, description: 'User is present in album' })
  @UseGuards(JwtAuthGuard)
  @Put('add-user/:id')
  addUser(
    @Request() req,
    @Param('id') id: number,
    @Body() getUser: GetUser,
  ): Promise<any> {
    const data: AddUser = { owner: req.user.userId, id, uid: getUser.id };
    return this.albumService.addUser(data);
  }
  @ApiTags('Album')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add Photo from Album' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found Photo Or album.' })
  @ApiResponse({ status: 400, description: 'Photo is present in album' })
  @UseGuards(JwtAuthGuard)
  @Put('add-photo/:id')
  addPhoto(@Param('id') id: number, @Body() getPhoto: GetPhoto): Promise<any> {
    return this.albumService.addPhoto(id, getPhoto.id);
  }
  @ApiTags('Album')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Transfer Photo' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found album.' })
  @UseGuards(JwtAuthGuard)
  @Put('transfer')
  async transfer(@Body() transfer: Transfer): Promise<Album> {
    return await this.albumService.transfer(transfer);
  }
  @ApiTags('Album')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Photo' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 403, description: 'No Permission.' })
  @ApiResponse({ status: 404, description: 'Not Found album.' })
  @UseGuards(JwtAuthGuard)
  @Delete('delete-photo/:id')
  async deletePhoto(
    @Request() req,
    @Param('id') id: number,
    @Body() deletePhoto: DeleteAlbumPhotos,
  ): Promise<Album> {
    console.log(deletePhoto);

    return this.albumService.deletePhoto(req.user.userId, id, deletePhoto);
  }
}

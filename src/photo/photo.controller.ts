import {
  Controller,
  Get,
  UseGuards,
  Request,
  Body,
  HttpStatus,
  HttpCode,
  Post,
  Delete,
  Put,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { CreatePhoto } from './dto/create-photo.dto';
import { DeletePhoto } from './dto/delete-photo.dto';
import { UpdatePhoto } from './dto/update-photo.dto';
import { Photo } from './photo.entity';
import { PhotoService } from './photo.service';
@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}
  @ApiTags('Photo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Photo' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 403, description: 'Not the owner.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  delete(@Request() req, @Body() deletePhoto: DeletePhoto): Promise<any> {
    return this.photoService.deletePhoto(req.user.userId, deletePhoto.id);
  }

  @ApiTags('Photo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Photo' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 403, description: 'Not the owner.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  update(
    @Request() req,
    @Param('id') id: number,
    @Body() updatePhoto: UpdatePhoto,
  ): Promise<Photo> {
    return this.photoService.updatePhoto(id, req.user.userId, updatePhoto);
  }
  @ApiTags('Photo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Photo' })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Failed' })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Request() req, @Body() createPhoto: CreatePhoto): Promise<Photo> {
    return this.photoService.createPhoto(req.user.userId, createPhoto);
  }

  @ApiTags('Photo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'All Photo' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  getOwn(): Promise<Photo[]> {
    return this.photoService.getOwn();
  }
  @ApiTags('Photo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'One Photo' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getOne(@Param('id') id: number): Promise<Photo> {
    return this.photoService.getOne(id);
  }
}

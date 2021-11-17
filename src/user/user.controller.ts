import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Patch,
  Param,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { ChangePassword } from './dto/change-password.dto';
import { UpdateInfo } from './dto/update-info.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('User')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Me' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 401, description: 'Not Logged In' })
  @UseGuards(JwtAuthGuard)
  @Get()
  me(@Request() req): Promise<User> {
    return this.userService.me(req.user.userId);
  }
  @ApiTags('User')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update pass' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Wrong pass or repeat pass' })
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword(
    @Request() req,
    @Body()
    changePass: ChangePassword,
  ): Promise<User> {
    return this.userService.changePassword(
      req.user.userId,
      changePass.password,
      changePass.new_password,
    );
  }
  @ApiTags('User')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Info' })
  @ApiResponse({ status: 200, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  @Patch('update-info')
  updateInfo(
    @Request() req,
    @Body()
    updateInfo: UpdateInfo,
  ): Promise<User> {
    return this.userService.updateInfo(req.user.userId, updateInfo);
  }
}

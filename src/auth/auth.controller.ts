import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from '../user/user.entity';
import { CreateUser } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { LoginUser } from './dto/login-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiTags('Auth')
  @Post('/register')
  @ApiOperation({ summary: 'Register' })
  @ApiResponse({ status: 201, description: 'Created.' })
  @ApiResponse({ status: 400, description: 'Validation Failed.' })
  @ApiResponse({ status: 409, description: 'Duplicate.' })
  Register(@Body() createUser: CreateUser): Promise<User> {
    return this.authService.register(createUser);
  }

  @ApiTags('Auth')
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login Success.' })
  @ApiResponse({ status: 400, description: 'Validation Failed.' })
  @ApiResponse({ status: 401, description: 'Wrong Username or password.' })
  async Login(@Request() req, @Body() loginUser: LoginUser): Promise<any> {
    return this.authService.login(req.user);
  }

  @ApiTags('Auth')
  @HttpCode(HttpStatus.OK)
  @Post('/verify/:email')
  @ApiOperation({ summary: 'Verify Email' })
  @ApiResponse({ status: 200, description: 'Success to verify' })
  @ApiResponse({ status: 401, description: 'Invalid JWT' })
  async Verify(@Param('email') email: string): Promise<object> {
    return this.authService.verify(email);
  }
}

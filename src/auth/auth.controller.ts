import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthInteceptor } from 'src/auth/auth.interceptor';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuthInteceptor)
export class AuthController {
  @Get('hello')
  async hello(@Req() req) {
    return req.user;
  }
}

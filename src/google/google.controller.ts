import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';

@Controller('google')
export class GoogleController {
  constructor(private authService: AuthService) {}
  @Get()
  @UseGuards(AuthGuard('google'))
  async authorize(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async redirect(@Req() req, @Res() response) {
    const token = this.authService.login(req.user);
    // return { access_token: token };
    return response.redirect(`${process.env.APP_URL}/home?token=${token}`);
  }
}

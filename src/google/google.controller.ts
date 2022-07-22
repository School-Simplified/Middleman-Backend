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
  constructor(private auth: AuthService) {}
  // @Get()
  // async authorize(@Res() response) {
  //   return response.redirect(await this.google.getUrl());
  // }
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    console.log(req.user);
  }

  // @Get('redirect')
  // async redirectFromGoogle(@Query('code') code: string, @Res() response) {
  //   const tokens = await this.google.exchangeCodeForToken(code);
  //   console.log(tokens);
  //   return response.redirect(
  //     `${process.env.APP_URL}/home?token=${tokens.access_token}?refresh=${tokens.refresh_token}`,
  //   );
  // }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() response) {
    return response.redirect(process.env.APP_URL);
    // const tokens = this.auth.login(req, {});
    // return response.redirect(
    //   `${process.env.APP_URL}/home?token=${tokens.access_token}?refresh=${tokens.refresh_token}`,
    // );
  }
}

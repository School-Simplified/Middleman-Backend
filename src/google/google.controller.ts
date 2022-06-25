import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { response } from 'express';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
  constructor(private google: GoogleService) {}
  @Get()
  async authorize(@Res() response) {
    return response.redirect(await this.google.getUrl());
  }

  @Get('redirect')
  async redirectFromGoogle(@Query('code') code: string, @Res() response) {
    const tokens = await this.google.exchangeCodeForToken(code);
    console.log(tokens);
    return response.redirect(
      `http://localhost:3000/home?token=${tokens.access_token}?refresh=${tokens.refresh_token}`,
    );
  }
}

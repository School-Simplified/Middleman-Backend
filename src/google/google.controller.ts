import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
  constructor(private google: GoogleService) {}
  @Get()
  async authorize(@Res() response) {
    return response.redirect(await this.google.getUrl());
  }

  @Get('redirect')
  async redirectFromGoogle(@Query('code') code: string) {
    return this.google.exchangeCodeForToken(code);
  }
}

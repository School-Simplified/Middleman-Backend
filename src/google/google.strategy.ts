import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { scopes } from './google.scopes';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:8000/google/redirect',
      scope: scopes,
    });
  }
  authorizationParams(): { [key: string]: string } {
    return {
      accessType: 'offline',
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    return {
      name: profile.displayName,
      email: profile.emails[0].value,
      picture: profile.photos[0].value,
      oAuthToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}

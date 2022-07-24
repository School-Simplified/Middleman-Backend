import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { scopes } from './google.scopes';
import { VolunteerService } from 'src/volunteers/volunteer.service';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private volunteerService: VolunteerService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: scopes,
    });
  }
  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline',
      prompt: 'consent',
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    this.volunteerService.setGoogleTokens(
      profile.emails[0].value,
      accessToken,
      refreshToken,
    );
    return {
      name: profile.displayName,
      email: profile.emails[0].value,
      picture: profile.photos[0].value,
    };
  }
}

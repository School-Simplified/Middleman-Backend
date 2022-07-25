import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private http: HttpService) {}
  private logger = new Logger(AuthService.name);
  login(user) {
    const payload = {
      ...user,
      createdAt: Date.now(),
    };
    return this.jwtService.sign(payload);
  }
  async validateToken(token: string): Promise<boolean> {
    try {
      const resp = await this.http.axiosRef.get(
        'https://oauth2.googleapis.com/tokeninfo',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (resp.status == 200) {
        return true;
      }
    } catch (err) {
      return false;
    }
  }
  async refreshGoogleToken(refresh: string): Promise<string> {
    const body = {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_SECRET,
      refresh_token: refresh,
      grant_type: 'refresh_token',
    };
    const resp = await this.http.axiosRef.post(
      'https://www.googleapis.com/oauth2/v4/token',
      body,
    );
    return resp.data.access_token as string;
  }
}

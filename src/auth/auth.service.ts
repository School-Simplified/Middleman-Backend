import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  login(user) {
    const payload = {
      ...user,
      createdAt: Date.now(),
    };
    return this.jwtService.sign(payload);
  }
}

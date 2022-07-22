import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { GoogleController } from './google.controller';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [AuthModule],
  controllers: [GoogleController],
  providers: [GoogleStrategy],
})
export class GoogleModule {}

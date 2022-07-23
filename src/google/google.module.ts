import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { VolunteerModule } from 'src/volunteers/volunteer.module';
import { VolunteerService } from 'src/volunteers/volunteer.service';
import { GoogleController } from './google.controller';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [AuthModule, VolunteerModule],
  controllers: [GoogleController],
  providers: [GoogleStrategy],
})
export class GoogleModule {}

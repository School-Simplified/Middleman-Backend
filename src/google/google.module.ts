import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { VolunteerModule } from 'src/volunteers/volunteer.module';
import { GoogleController } from './google.controller';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [AuthModule, VolunteerModule],
  controllers: [GoogleController],
  providers: [GoogleStrategy],
  exports: [],
})
export class GoogleModule {}

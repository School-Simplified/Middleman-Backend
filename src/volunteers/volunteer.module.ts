import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { VolunteerService } from './volunteer.service';
import { VolunteerController } from './volunteer.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [VolunteerService, PrismaService, AuthService, JwtService],
  controllers: [VolunteerController],
  imports: [HttpModule],
  exports: [VolunteerService],
})
export class VolunteerModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { VolunteerService } from './volunteer.service';
import { VolunteerController } from './volunteer.controller';
import { GoogleModule } from 'src/google/google.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [VolunteerService, PrismaService],
  controllers: [VolunteerController],
  imports: [HttpModule],
  exports: [VolunteerService],
})
export class VolunteerModule {}

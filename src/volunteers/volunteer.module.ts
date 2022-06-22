import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { VolunteerService } from './volunteer.service';
import { VolunteerController } from './volunteer.controller';

@Module({
  providers: [VolunteerService, PrismaService],
  controllers: [VolunteerController],
  imports: [],
})
export class VolunteerModule {}

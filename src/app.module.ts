import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { VolunteerModule } from './volunteers/volunteer.module';
import { GoogleModule } from './google/google.module';

@Module({
  imports: [VolunteerModule, GoogleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

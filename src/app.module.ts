import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { VolunteerModule } from './volunteers/volunteer.module';
import { GoogleModule } from './google/google.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [VolunteerModule, GoogleModule, AuthModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Body,
  ImATeapotException,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Prisma, Volunteer } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthInteceptor } from '../auth/auth.interceptor';
import { VolunteerService } from './volunteer.service';

@Controller('api/volunteers/')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuthInteceptor)
export class VolunteerController {
  constructor(private volunteerService: VolunteerService) {}
  @Get('hello')
  async hello(@Req() req) {
    return req.user;
  }
  @Get()
  async getUsers(@Req() req): Promise<Volunteer[]> {
    console.log(req.user.token);
    return await this.volunteerService.getUsers();
  }

  @Post()
  async createUser(
    @Body() data: Prisma.VolunteerCreateInput,
    @Req() req,
  ): Promise<any> {
    try {
      return await this.volunteerService.createUser(data, req.user.token);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('many')
  async createManyUsers(
    @Body() data: Prisma.VolunteerCreateManyInput,
  ): Promise<any> {
    try {
      return await this.volunteerService.createManyUsers(data);
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') id,
    @Body() data: Prisma.VolunteerUpdateInput,
  ): Promise<Volunteer> {
    id = parseInt(id);
    try {
      return await this.volunteerService.editUser(id, data);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id): Promise<Volunteer> {
    id = parseInt(id);
    try {
      return await this.volunteerService.deleteUser(id);
    } catch (err) {
      console.error(err);
      throw new NotFoundException(err);
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id): Promise<Volunteer> {
    id = parseInt(id);
    try {
      return await this.volunteerService.getUserById(id);
    } catch (err) {
      console.error(err);
      throw new NotFoundException(err);
    }
  }
}

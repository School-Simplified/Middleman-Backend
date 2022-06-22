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
} from '@nestjs/common';
import { Prisma, Volunteer } from '@prisma/client';
import { NotFoundError } from 'rxjs';
import { PrismaService } from 'src/prisma.service';
import { VolunteerService } from './volunteer.service';
@Controller('api/volunteers/')
export class VolunteerController {
  constructor(private volunteerService: VolunteerService) {}

  @Get()
  async getUsers(): Promise<Volunteer[]> {
    return await this.volunteerService.getUsers();
  }

  @Post()
  async createUser(
    @Body() data: Prisma.VolunteerCreateInput,
  ): Promise<Volunteer> {
    try {
      return await this.volunteerService.createUser(data);
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
  @Put('/:id')
  async updateUser(
    @Param('id') id,
    data: Prisma.VolunteerUpdateInput,
  ): Promise<Volunteer> {
    id = parseInt(id);
    try {
      return await this.volunteerService.editUser(id, data);
    } catch (err) {
      throw new NotFoundException(err);
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

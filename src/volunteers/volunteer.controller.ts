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
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma, Volunteer } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateVolunteerDto } from 'src/dto/create-volunteer.dto';
import { UpdateVolunteerDto } from 'src/dto/update-volunteer.dto';
import { AuthInteceptor } from '../auth/auth.interceptor';
import { VolunteerService } from './volunteer.service';

@ApiBearerAuth()
@ApiTags('volunteers')
@Controller('api/volunteers/')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuthInteceptor)
export class VolunteerController {
  constructor(private volunteerService: VolunteerService) {}

  @Get()
  async getUsers(@Req() req): Promise<any> {
    const users = await this.volunteerService.getUsers();
    const googleUsers = await this.volunteerService.getGsuiteAccounts(
      req.user.token,
    );
    return { users, googleUsers };
  }
  @Post()
  async createUser(@Body() data: CreateVolunteerDto, @Req() req): Promise<any> {
    try {
      return await this.volunteerService.createUser(data, req.user.token);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('many')
  async createManyUsers(@Body() data: CreateVolunteerDto[]): Promise<any> {
    try {
      return await this.volunteerService.createManyUsers(
        data as Prisma.VolunteerCreateManyInput,
      );
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') id,
    @Body() data: UpdateVolunteerDto,
  ): Promise<Volunteer> {
    id = parseInt(id);
    try {
      return await this.volunteerService.editUser(id, data);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<any> {
    return await this.volunteerService.deleteUser(id, req.user.token);
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<Volunteer> {
    try {
      return await this.volunteerService.getUserById(id);
    } catch (err) {
      console.error(err);
      throw new NotFoundException(err);
    }
  }
}

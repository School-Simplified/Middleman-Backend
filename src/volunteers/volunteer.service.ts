import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class VolunteerService {
  constructor(private prisma: PrismaService) {}
  async getUsers() {
    return await this.prisma.volunteer.findMany();
  }

  async createUser(user: Prisma.VolunteerCreateInput) {
    return await this.prisma.volunteer.create({
      data: user,
    });
  }

  async editUser(id: number, data: Prisma.VolunteerUpdateInput) {
    return await this.prisma.volunteer.update({
      where: {
        ID: id,
      },
      data,
    });
  }

  async deleteUser(id: number) {
    return await this.prisma.volunteer.delete({
      where: { ID: id },
    });
  }

  async createManyUsers(data: Prisma.VolunteerCreateManyInput) {
    return await this.prisma.volunteer.createMany({ data });
  }

  async getUserById(id: number) {
    return await this.prisma.volunteer.findUnique({ where: { ID: id } });
  }
}

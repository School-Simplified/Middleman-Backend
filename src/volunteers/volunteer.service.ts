import { BadRequestException, Injectable, Logger, Req } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
@Injectable()
export class VolunteerService {
  constructor(private prisma: PrismaService, private http: HttpService) {}
  private readonly logger = new Logger(VolunteerService.name);
  async getUsers() {
    return await this.prisma.volunteer.findMany({
      orderBy: [{ fullName: 'asc' }],
    });
  }

  async createUser(user: Prisma.VolunteerCreateInput, token: string) {
    const [givenName, familyName] = user.fullName.split(' ');
    const googleData = {
      primaryEmail: user.orgEmail,
      password: 'schoolsimplified',
      name: { givenName, familyName },
      changePasswordAtNextLogin: true,
    };
    const r = await Promise.all([
      await this.prisma.volunteer.create({
        data: user,
      }),
      await this.createGsuiteAccount(googleData, token),
    ]);
    return r;
  }

  async createGsuiteAccount(data, token) {
    const resp = await this.http.axiosRef.post(
      `https://script.googleapis.com/v1/scripts/${process.env.GOOGLE_APP_SCRIPT_ID}:run`,
      {
        function: 'createUser',
        devMode: true,
        parameters: [data],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(resp.data);
    if (resp.data.error) {
      throw new BadRequestException(resp.data);
    }
    return resp.data;
  }
  async deleteGsuiteAccount(email: string, token: string) {
    const resp = await this.http.axiosRef.post(
      `https://script.googleapis.com/v1/scripts/${process.env.GOOGLE_APP_SCRIPT_ID}:run`,
      {
        function: 'createUser',
        devMode: true,
        parameters: [email],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(resp.data);
    if (resp.data.error) {
      throw new BadRequestException(resp.data);
    }
    return resp.data;
  }
  async editUser(id: number, data: Prisma.VolunteerUpdateInput) {
    return await this.prisma.volunteer.update({
      where: {
        ID: id,
      },
      data,
    });
  }

  async deleteUser(id: number, token: string) {
    const deletedUser = await this.prisma.volunteer.delete({
      where: { ID: id },
    });
    const resp = await this.deleteGsuiteAccount(deletedUser.orgEmail, token);
    return [deletedUser, resp];
  }

  async createManyUsers(data: Prisma.VolunteerCreateManyInput) {
    return await this.prisma.volunteer.createMany({ data });
  }

  async getUserById(id: number) {
    return await this.prisma.volunteer.findUnique({ where: { ID: id } });
  }

  async getUserByEmail(email: string) {
    return await this.prisma.volunteer.findUnique({
      where: { orgEmail: email },
    });
  }
  async setGoogleTokens(email: string, token: string, refresh: string) {
    console.log(`Refresh token: ${refresh}`);
    return await this.prisma.volunteer.update({
      where: {
        orgEmail: email,
      },
      data: {
        googleOauthToken: token,
        googleRefreshToken: refresh,
      },
    });
  }
}

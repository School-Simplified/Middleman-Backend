import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import axios from 'axios';
@Injectable()
export class VolunteerService {
  constructor(private prisma: PrismaService) {}
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
    const resp = await axios.post(
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

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateVolunteerDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  orgEmail: string;

  @ApiProperty()
  ranks?: string;

  @ApiProperty()
  department_division?: string;

  @ApiProperty()
  departments?: string;

  @ApiProperty()
  activityStatus?: string;

  @ApiProperty()
  contract?: string;

  @ApiProperty()
  breakDuration?: string;

  @ApiProperty()
  strikes?: number;

  @ApiProperty()
  @IsNotEmpty()
  discordTag: string;

  @ApiProperty()
  roleID?: number;

  @ApiProperty()
  googleOauthToken?: string;

  @ApiProperty()
  googleRefreshToken?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../enums/enum';
import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiProperty({ example: 'admin123' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: 'admin'})
  @IsEnum(Role)
  @IsNotEmpty()
  readonly role: Role;
}

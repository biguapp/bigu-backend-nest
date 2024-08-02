import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiProperty({ example: 'admin123' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

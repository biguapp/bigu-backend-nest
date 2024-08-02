import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateAdminDto {
  @ApiProperty({ example: 'admin@example.com', required: false })
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiProperty({ example: 'admin123', required: false })
  @IsString()
  @IsOptional()
  readonly password?: string;
}

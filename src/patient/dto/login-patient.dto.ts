import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginPatientDto {
  @ApiProperty({ example: '10050972405' })
  @IsString()
  @IsNotEmpty()
  readonly cpf: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

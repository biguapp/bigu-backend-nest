import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserResponseDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'Matrícula do usuário', example: '2021001234' })
  @IsString()
  @IsNotEmpty()
  readonly matricula: string;

  @ApiProperty({ description: 'Sexo do usuário', example: 'Masculino' })
  @IsString()
  @IsNotEmpty()
  readonly sex: string;

  @ApiProperty({ example: 'name@email.com' })
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'Número de telefone do usuário',
    example: '(83) 99999-9999',
  })
  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly avgScore: number;

  feedbacks: string[];

  readonly isVerified: boolean;
}

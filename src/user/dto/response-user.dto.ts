import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserResponseDto {
  @ApiProperty({ description: 'Foto de perfil do usuário' })
  @IsOptional()
  readonly profileImage?: Buffer;

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

  @ApiProperty({
    description: 'Pontuação media das avaliações recebidas pelo usuário (0-5)',
    example: 4.3,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly avgScore: number;

  @ApiProperty({
    description: 'Quantidade de avaliações recebidas pelo usuário',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly ratingCount: number;

  feedbacks: string[];

  readonly isVerified: boolean;
}

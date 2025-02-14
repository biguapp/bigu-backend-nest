import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@src/enums/enum';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
} from 'class-validator';

export class UserResponseDto {
  @ApiProperty({ description: 'Foto de perfil do usuário' })
  @IsOptional()
  readonly profileImage?: Buffer;

  @ApiProperty({ description: 'Foto de perfil do usuário' })
  @IsOptional()
  readonly idPhoto?: Buffer;

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

  @ApiProperty({
    description: 'Quantidade de caronas oferecidas pelo usuário',
    example: 0,
    required: false,
  })
  @IsOptional()
  readonly offeredRidesCount?: number;

  @ApiProperty({
    description: 'Status do documento do usuário (pending, approved, rejected)',
    example: 'pending',
  })
  @IsString()
  @IsNotEmpty()
  readonly documentStatus: 'pending' | 'approved' | 'rejected' | 'inReview';

  @ApiProperty({
    description: 'Motivo para a reprovação do documento, caso tenha',
    example: 'Document is unclear.',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly verificationReason?: string;

  @ApiProperty({
    description: 'Quantidade de caronas recebidas pelo usuário',
    example: 0,
    required: false,
  })
  @IsOptional()
  readonly takenRidesCount?: number;

  feedbacks: string[];

  readonly isVerified: boolean;

  @ApiProperty({ description: 'IDs das denúncias que o usuário recebeu' })
  @IsArray()
  readonly reports: string[];

  @ApiProperty({ description: 'Role do usuário' })
  readonly role: Role.User;
}

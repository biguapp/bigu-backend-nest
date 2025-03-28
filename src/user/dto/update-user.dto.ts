import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { Role } from '../../enums/enum';
import { CreateVehicleDto } from '../../vehicle/dto/create-vehicle.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'Foto de perfil do usuário', required: false })
  @IsOptional()
  readonly profileImage?: Buffer;

  @ApiProperty({ description: 'Foto do documento do usuário', required: false })
  @IsOptional()
  readonly idPhoto?: Buffer;

  @ApiProperty({ description: 'Status da análise do documento do usuário', required: false })
  @IsOptional()
  readonly documentStatus?: 'pending' | 'approved' | 'rejected' | 'inReview';
  
  @ApiProperty({ description: 'Motivo da recusa', required: false })
  @IsOptional()
  readonly verificationReason?: string

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    required: false,
  })
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    description: 'Sexo do usuário',
    example: 'Masculino',
    required: false,
  })
  @IsOptional()
  readonly sex?: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@ufcg.edu.br',
    required: false,
  })
  @IsOptional()
  @Matches(/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)*ufcg\.edu\.br$/, {
    message: 'O email de cadastro deve ser o acadêmico.',
  })
  readonly email?: string;

  @ApiProperty({
    description: 'Matrícula do usuário',
    example: '2021001234',
    required: false,
  })
  @IsOptional()
  readonly matricula?: string;

  @ApiProperty({
    description: 'Número de telefone do usuário',
    example: '(83) 99999-9999',
    required: false,
  })
  @IsOptional()
  readonly phoneNumber?: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'password123',
    required: false,
  })
  @IsOptional()
  readonly password?: string;

  @ApiProperty({
    description: 'Papel do usuário',
    example: Role.User,
    required: false,
  })
  @IsOptional()
  readonly role?: Role;

  @ApiProperty({
    description: 'IDs dos feedbacks do usuário',
    type: [String],
    required: false,
  })
  @IsOptional()
  readonly feedbacks?: string[];

  @ApiProperty({
    description: 'Pontuação média do usuário',
    example: 0,
    required: false,
  })
  @IsOptional()
  readonly avgScore?: number;

  @ApiProperty({
    description: 'Quantidade de avaliações recebidas pelo usuário',
    example: 10,
    required: false,
  })
  @IsOptional()
  readonly ratingCount?: number;

  @ApiProperty({
    description: 'Quantidade de caronas oferecidas pelo usuário',
    example: 0,
    required: false,
  })
  @IsOptional()
  readonly offeredRidesCount?: number;

  @ApiProperty({
    description: 'Quantidade de caronas recebidas pelo usuário',
    example: 0,
    required: false,
  })
  @IsOptional()
  readonly takenRidesCount?: number;

  readonly verificationCode?: string;

  readonly isVerified?: boolean;
}

import { ApiProperty } from "@nestjs/swagger";

export class CreatePatientDto {
    @ApiProperty({ example: '123.456.789-10'})
    readonly cpf: string;
    @ApiProperty({ example: 'João da Silva' })
    readonly nome: string;
    @ApiProperty({ example: 'Joãozinho', required: false })
    readonly nomeSocial?: string;
    @ApiProperty({ example: 'Maria da Silva' })
    readonly nomeMae: string;
    @ApiProperty({ example: 'José da Silva', required: false })
    readonly nomePai?: string;
    @ApiProperty({ example: '123456789012345' })
    readonly numeroSus: string;
    @ApiProperty({ example: 'O+', required: false })
    readonly tipoSanguineo?: string;
    @ApiProperty({ example: '03-01-2000' })
    readonly dataNascimento: Date;
    @ApiProperty({ example: 'Masculino' })
    readonly sexo: string;
    @ApiProperty({ example: 'Solteiro', required: false })
    readonly estadoCivil?: string;
    @ApiProperty({ example: 'joao@example.com' })
    readonly email: string;
    @ApiProperty({ example: 'senha123' })
    readonly senha: string;
    @ApiProperty({ example: '(11) 98765-4321' })
    readonly celular: string;
    @ApiProperty({ example: 'Branco', required: false })
    readonly racaCor?: string;
    @ApiProperty({
        example: {
          rua: 'Rua das Flores',
          numero: '123',
          complemento: 'Apt 45',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '12345-678',
        },
    })
    readonly endereco: {
      readonly rua?: string;
      readonly numero?: string;
      readonly complemento?: string;
      readonly bairro?: string;
      readonly cidade?: string;
      readonly estado?: string;
      readonly cep?: string;
    };
  }
  
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CepService {
  private readonly cepApiUrl = 'https://viacep.com.br/ws';

  async buscarEnderecoPorCep(cep: string): Promise<any> {
    try {
      const response = await axios.get(`${this.cepApiUrl}/${cep}/json/`);
      if (response.data.erro) {
        throw new HttpException('CEP não encontrado', HttpStatus.NOT_FOUND);
      }
      return response.data;
    } catch (error) {
      throw new HttpException('Erro ao consultar o CEP', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

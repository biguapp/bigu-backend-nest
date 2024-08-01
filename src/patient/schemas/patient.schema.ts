import { Schema } from 'mongoose';

export const PatientSchema = new Schema({
  cpf: { type: String, required: true },
  nome: { type: String, required: true },
  nomeSocial: { type: String },
  nomeMae: { type: String, required: true },
  nomePai: { type: String },
  numeroSus: { type: String, required: true },
  tipoSanguineo: { type: String },
  dataNascimento: { type: Date, required: true },
  sexo: { type: String, required: true },
  estadoCivil: { type: String },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  celular: { type: String, required: true },
  racaCor: { type: String },
  endereco: {
    rua: { type: String },
    numero: { type: String },
    complemento: { type: String },
    bairro: { type: String },
    cidade: { type: String },
    estado: { type: String },
    cep: { type: String },
  },
});

import { Schema } from 'mongoose';

export const PatientSchema = new Schema({
  cpf: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{11}$/,
  },
  nome: { type: String, required: true },
  nomeSocial: { type: String },
  nomeMae: { type: String, required: true },
  nomePai: { type: String },
  numeroSus: {
    type: String,
    required: true,
    match: /^[0-9]{15}$/, // Validação de 15 dígitos
  },
  tipoSanguineo: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    default: 'O+',
  },
  dataNascimento: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value < Date.now();
      },
      message: 'Data de nascimento deve ser no passado.',
    },
  },
  sexo: {
    type: String,
    required: true,
    enum: ['Masculino', 'Feminino', 'Outro'],
  },
  estadoCivil: {
    type: String,
    enum: ['Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'Outro'],
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Validação de email
  },
  password: { type: String, required: true },
  celular: { 
    type: String, 
    required: true,
    match: /^\(\d{2}\) \d{5}-\d{4}$/ // Validação para o formato (xx) xxxxx-xxxx
  },
  racaCor: { type: String, enum: ['Branco', 'Preto', 'Pardo', 'Amarelo', 'Indígena', 'Outro'] },
  endereco: {
    rua: { type: String },
    numero: { type: String },
    complemento: { type: String },
    bairro: { type: String },
    cidade: { type: String },
    estado: { type: String, match: /^[A-Z]{2}$/ }, // Validação para siglas de estados brasileiros
    cep: { 
      type: String, 
      match: /^[0-9]{5}-[0-9]{3}$/ // Validação para o formato 00000-000
    },
  },
})

export const Patient = { name: 'Patient', schema: PatientSchema };

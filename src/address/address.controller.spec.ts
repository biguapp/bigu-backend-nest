import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';

describe('AddressController', () => {
  let controller: AddressController;
  let service: AddressService;

  const mockAddress = {
    _id: '1',
    nome: 'Casa',
    rua: 'Avenida Paulista',
    numero: '1234',
    complemento: 'Apt 56',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01311-000',
    toDTO: jest.fn().mockReturnValue({
      nome: 'Casa',
      rua: 'Avenida Paulista',
      numero: '1234',
      complemento: 'Apt 56',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      addressId: '1',
    }),
  };

  const mockAddressService = {
    create: jest.fn().mockResolvedValue(mockAddress),
    findAll: jest.fn().mockResolvedValue([mockAddress]),
    findOne: jest.fn().mockResolvedValue(mockAddress),
    update: jest.fn().mockResolvedValue(mockAddress),
    remove: jest.fn().mockResolvedValue(mockAddress),
    getUserAddresses: jest.fn().mockResolvedValue([mockAddress]),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        { provide: AddressService, useValue: mockAddressService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) }) // Simula o JwtAuthGuard como válido
      .compile();

    controller = module.get<AddressController>(AddressController);
    service = module.get<AddressService>(AddressService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an address', async () => {
      const createAddressDto: CreateAddressDto = {
        nome: 'Casa',
        rua: 'Avenida Paulista',
        numero: '1234',
        complemento: 'Apt 56',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01311-000',
      };

      const mockRequest = { user: { sub: 'user123' } };
      await controller.create(mockRequest, createAddressDto, mockResponse);

      expect(service.create).toHaveBeenCalledWith(createAddressDto, 'user123');
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'O endereço foi criado com sucesso.',
        userAddress: mockAddress.toDTO(),
      });
    });
  });

  describe('findAll', () => {
    it('should return all addresses', async () => {
      await controller.findAll(mockResponse);
      expect(service.findAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Todos os endereços foram retornados.",
        addresses: [mockAddress.toDTO()],
      });
    });
  });

  describe('findOne', () => {
    it('should return an address by ID', async () => {
      await controller.findOne('1', mockResponse);
      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "O endereço foi retornado com sucesso.",
        address: mockAddress.toDTO(),
      });
    });

    it('should return 404 if address not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());
      await controller.findOne('2', mockResponse);
      expect(service.findOne).toHaveBeenCalledWith('2');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Endereço não encontrado.',
      });
    });
  });

  describe('update', () => {
    it('should update an address', async () => {
      const updateAddressDto: UpdateAddressDto = { nome: 'Casa Atualizada' };
      await controller.update('1', updateAddressDto, mockResponse);
      expect(service.update).toHaveBeenCalledWith('1', updateAddressDto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "O endereço foi atualizado com sucesso.",
        addressUpdated: mockAddress.toDTO(),
      });
    });
  });

  describe('remove', () => {
    it('should delete an address', async () => {
      await controller.remove(mockResponse, '1');
      expect(service.remove).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "O endereço foi removido com sucesso.",
        addressRemoved: mockAddress.toDTO(),
      });
    });
  });

  describe('getUserAddresses', () => {
    it('should return all addresses of the authenticated user', async () => {
      const mockRequest = { user: { sub: 'user123' } };
      await controller.getUserAddresses(mockResponse, mockRequest);
      expect(service.getUserAddresses).toHaveBeenCalledWith('user123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Os endereços do usuário foram retornados com sucesso.',
        userAddress: [mockAddress.toDTO()],
      });
    });
  });
});

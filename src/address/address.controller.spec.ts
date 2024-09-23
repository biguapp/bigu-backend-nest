import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './interfaces/address.interface';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';

// Mock do AddressService
const mockAddressService = {
  create: jest.fn().mockResolvedValue({
    /* mock do endereço criado */
  } as Address),
  findAll: jest.fn().mockResolvedValue([
    {
      /* mock de endereços */
    },
  ] as Address[]),
  findOne: jest.fn().mockResolvedValue({
    /* mock de um endereço */
  } as Address),
  update: jest.fn().mockResolvedValue({
    /* mock do endereço atualizado */
  } as Address),
  remove: jest.fn().mockResolvedValue(undefined),
  removeAll: jest.fn().mockResolvedValue(undefined),
};

describe('AddressController', () => {
  let controller: AddressController;
  let service: AddressService;

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true), // Permite a ativação do guard nas rotas protegidas
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: AddressService,
          useValue: mockAddressService,
        },
        {
          provide: JwtAuthGuard,
          useValue: mockJwtAuthGuard,
        },
      ],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    service = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Teste para o método create
  it('should create a new address', async () => {
    const createAddressDto: CreateAddressDto = {
      nome: 'Teste',
      rua: 'Rua Teste',
      numero: '123',
      bairro: 'Bairro Teste',
      cidade: 'Cidade Teste',
      estado: 'Estado Teste',
      cep: '12345-678',
    };

    const result = await controller.create('req', createAddressDto, 'res: '); // mockar um user depois
    expect(result).toEqual({
      /* mock do endereço criado */
    });
    expect(service.create).toHaveBeenCalledWith(createAddressDto);
  });

  // Teste para o método findAll
  it('should return an array of addresses', async () => {
    const result = await controller.findAll('res: ');
    expect(result).toEqual([
      {
        /* mock de endereços */
      },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  // Teste para o método findOne
  it('should return a single address by ID', async () => {
    const id = 'some-id';
    const result = await controller.findOne(id, 'res: ');
    expect(result).toEqual({
      /* mock de um endereço */
    });
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  // Teste para o método update
  it('should update an address by ID', async () => {
    const id = 'some-id';
    const updateAddressDto: UpdateAddressDto = {
      rua: 'Rua Atualizada',
      numero: '456',
      bairro: 'Bairro Atualizado',
      cidade: 'Cidade Atualizada',
      estado: 'Estado Atualizado',
      cep: '98765-432',
    };

    const result = await controller.update(id, updateAddressDto, 'res: ');
    expect(result).toEqual({
      /* mock do endereço atualizado */
    });
    expect(service.update).toHaveBeenCalledWith(id, updateAddressDto);
  });

  // Teste para o método remove
  it('should remove an address by ID', async () => {
    const id = 'some-id';
    await controller.remove('res: ', id);
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});

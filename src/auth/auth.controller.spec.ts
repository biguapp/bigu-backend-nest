import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    loginAdmin: jest.fn(),
    loginUser: jest.fn(),
    registerUser: jest.fn(),
    registerAdmin: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getModelToken('BlacklistedToken'), // Mocking BlacklistedTokenModel
          useValue: {
            // Mock methods for BlacklistedTokenModel if necessary
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  // describe('loginUser', () => {
  //   it('should return an access token for valid credentials', async () => {
  //     const loginUserDto: LoginUserDto = {
  //       email: 'user@mail.com',
  //       password: 'password',
  //     };
  //     jest.spyOn(authService, 'loginUser').mockResolvedValue('jwt-token');

  //     const result = await controller.loginUser(loginUserDto);
  //     expect(result).toEqual({ access_token: 'jwt-token' });
  //   });

  //   it('should throw BadRequestException for invalid credentials', async () => {
  //     const loginUserDto: LoginUserDto = {
  //       email: 'user@mail.com',
  //       password: 'password',
  //     };
  //     jest.spyOn(authService, 'loginUser').mockResolvedValue(null);

  //     await expect(controller.loginUser(loginUserDto)).rejects.toThrow(
  //       BadRequestException,
  //     );
  //   });
  // });

  // describe('registerUser', () => {
  //   it('should register a user and return a success message', async () => {
  //     const createUserDto: CreateUserDto = {
  //       name: 'User Name',
  //       sex: 'Masculino',
  //       email: 'user@example.com',
  //       matricula: '2021001234',
  //       phoneNumber: '(11) 98765-4321',
  //       password: 'password',
  //     };
  //     const mockUser: User = {
  //       _id: 1,
  //       name: 'User Name',
  //       sex: 'Masculino',
  //       email: 'user@example.com',
  //       matricula: '2021001234',
  //       phoneNumber: '(11) 98765-4321',
  //       password: 'hashedPassword',
  //       role: Role.User,
  //       avgScore: 4.5,
  //     } as User;
  //     jest.spyOn(authService, 'registerUser').mockResolvedValue(mockUser);

  //     const result = await controller.registerUser(createUserDto);
  //     expect(result).toEqual({ message: 'User registered successfully' });
  //   });

    // it('should throw BadRequestException if registration fails', async () => {
    //   const createUserDto: CreateUserDto = {
    //     name: 'User Name',
    //     sex: 'Masculino',
    //     email: 'user@example.com',
    //     matricula: '2021001234',
    //     phoneNumber: '(11) 98765-4321',
    //     password: 'password',
    //   };
    //   jest.spyOn(authService, 'registerUser').mockResolvedValue(null);

    //   await expect(controller.registerUser(createUserDto)).rejects.toThrow(
    //     BadRequestException,
    //   );
    // });
//   });
});

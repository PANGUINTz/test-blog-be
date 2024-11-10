import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { StringService } from '../common/utils/string.service';
import { JwtGuard } from './guards/jwt.guard';
import { SignInDto, SignUpDto } from './dtos/auth.dto';

jest.mock('../common/utils/string.service');
jest.mock('../users/users.service');
jest.mock('./auth.service');
jest.mock('./guards/jwt.guard');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;
  let stringService: StringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        StringService,
        // We mock the services used in the constructor
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn().mockResolvedValue({ success: true }),
            signIn: jest.fn().mockResolvedValue({ token: 'some_token' }),
            getProfile: jest
              .fn()
              .mockResolvedValue({ id: 1, name: 'Test User' }),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findBySlug: jest
              .fn()
              .mockResolvedValue({ data: { id: 1, slug: 'user-slug' } }),
          },
        },
        {
          provide: StringService,
          useValue: {
            generateRandomString: jest.fn().mockReturnValue('random_slug'),
          },
        },
        // Mock JwtGuard for the `info` route
        {
          provide: JwtGuard,
          useValue: {
            canActivate: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    stringService = module.get<StringService>(StringService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signUp', () => {
    it('should call signUp on AuthService and return the result', async () => {
      const signUpDto: SignUpDto = { username: 'test', password: 'password' }; // Example DTO
      const result = await authController.signUp(signUpDto);

      expect(result).toEqual({ success: true });
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto, 'random_slug');
    });
  });

  describe('signIn', () => {
    it('should call signIn on AuthService and return the result', async () => {
      const signInDto: SignInDto = { username: 'test', password: 'password' }; // Example DTO
      const result = await authController.signIn(signInDto);

      expect(result).toEqual({ token: 'some_token' });
      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
    });
  });

  describe('info', () => {
    it('should return user profile info', async () => {
      const mockRequest: any = {
        user: { slug: 'user-slug' },
      };
      const result = await authController.Info(mockRequest);

      expect(result).toEqual({ id: 1, name: 'Test User' });
      expect(usersService.findBySlug).toHaveBeenCalledWith('user-slug');
      expect(authService.getProfile).toHaveBeenCalledWith(1);
    });
  });
});

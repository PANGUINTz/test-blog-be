import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest
              .fn()
              .mockResolvedValue([{ id: 1, name: 'Test User' }]), // Mock findAll method
            findBySlug: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Test User',
              slug: 'user-slug',
            }), // Mock findBySlug method
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await usersController.findAll();
      expect(result).toEqual([{ id: 1, name: 'Test User' }]);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findBySlug', () => {
    it('should return a user by slug', async () => {
      const result = await usersController.findBySlug('user-slug');
      expect(result).toEqual({ id: 1, name: 'Test User', slug: 'user-slug' });
      expect(usersService.findBySlug).toHaveBeenCalledWith('user-slug');
    });
  });
});

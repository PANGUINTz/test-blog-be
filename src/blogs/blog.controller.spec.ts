import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { StringService } from '../common/utils/string.service';
import { UsersService } from '../users/users.service';
import { CreateBlogDto, ParamBlogDto, UpdateBlogDto } from './dtos/blog.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AuthorGuard } from '../auth/guards/author.guard';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { Category } from '../common/enums/category.enum';

// Mocking services and guards
const mockBlogsService = {
  findAll: jest.fn(),
  findBySlug: jest.fn(),
  findByUserSlug: jest.fn(),
  createBlog: jest.fn(),
  updateBlog: jest.fn(),
  deleteBlog: jest.fn(),
};

const mockStringService = {
  generateRandomString: jest.fn(),
};

const mockUsersService = {
  findBySlug: jest.fn(),
};

describe('BlogsController', () => {
  let blogsController: BlogsController;
  let blogsService: BlogsService;
  let stringService: StringService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogsController],
      providers: [
        { provide: BlogsService, useValue: mockBlogsService },
        { provide: StringService, useValue: mockStringService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    blogsController = module.get<BlogsController>(BlogsController);
    blogsService = module.get<BlogsService>(BlogsService);
    stringService = module.get<StringService>(StringService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(blogsController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all blogs', async () => {
      const result = [{ id: 1, title: 'Blog 1' }];
      mockBlogsService.findAll.mockResolvedValue(result);

      expect(await blogsController.findAll()).toBe(result);
    });
  });

  describe('findBySlug', () => {
    it('should return a blog by slug', async () => {
      const result = { id: 1, title: 'Blog 1', slug: 'blog-1' };
      mockBlogsService.findBySlug.mockResolvedValue(result);

      expect(await blogsController.findBySlug('blog-1')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new blog and return it', async () => {
      const createBlogDto: CreateBlogDto = {
        title: 'New Blog',
        content: 'Content',
        category: Category.FOOD,
      };
      const userData = { slug: 'user-1' };
      const slug = 'random-slug';
      const user = { id: 1, slug: 'user-1', name: 'User' };

      mockStringService.generateRandomString.mockReturnValue(slug);
      mockUsersService.findBySlug.mockResolvedValue({ data: user });
      mockBlogsService.createBlog.mockResolvedValue({
        id: 1,
        ...createBlogDto,
        slug,
        user,
      });

      const req: any = { user: { slug: 'user-1' } } as any;

      expect(await blogsController.create(createBlogDto, req)).toEqual({
        id: 1,
        ...createBlogDto,
        slug,
        user,
      });
    });
  });

  describe('update', () => {
    it('should update a blog and return it', async () => {
      const params: ParamBlogDto = { slug: 'blog-1' };
      const updateBlogDto: UpdateBlogDto = {
        title: 'Updated Blog',
        content: 'Updated Content',
        category: Category.FOOD,
      };

      const result = {
        id: 1,
        title: 'Updated Blog',
        content: 'Updated Content',
        slug: 'blog-1',
      };
      mockBlogsService.updateBlog.mockResolvedValue(result);

      expect(await blogsController.update(params, updateBlogDto)).toBe(result);
    });
  });

  describe('delete', () => {
    it('should delete a blog and return a success message', async () => {
      const params: ParamBlogDto = { slug: 'blog-1' };

      mockBlogsService.deleteBlog.mockResolvedValue({
        message: 'Blog deleted successfully',
      });

      expect(await blogsController.deleteBlog(params)).toEqual({
        message: 'Blog deleted successfully',
      });
    });
  });
});

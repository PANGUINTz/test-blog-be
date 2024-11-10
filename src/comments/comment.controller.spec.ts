import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { UsersService } from '../users/users.service';
import { BlogsService } from '../blogs/blogs.service';
import { StringService } from '../common/utils/string.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AuthorCommentGuard } from '../auth/guards/author.guard';
import { Request } from 'express';
import {
  CreateCommentDto,
  UpdateCommentDto,
  ParamCommentDto,
  ParamCreateCommentDto,
} from './dtos/comment.dto';

describe('CommentsController', () => {
  let commentsController: CommentsController;
  let commentsService: CommentsService;
  let usersService: UsersService;
  let blogsService: BlogsService;
  let stringService: StringService;

  const mockUserData = { slug: 'user-slug', id: 1 };
  const mockBlogData = {
    slug: 'blog-slug',
    title: 'Blog Title',
    content: 'Blog Content',
  };
  const mockCommentData = { slug: 'comment-slug', content: 'Comment Content' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockCommentData]),
            findBySlug: jest.fn().mockResolvedValue(mockCommentData),
            createComment: jest.fn().mockResolvedValue(mockCommentData),
            updateComment: jest.fn().mockResolvedValue(mockCommentData),
            deleteComment: jest.fn().mockResolvedValue(mockCommentData),
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
          provide: BlogsService,
          useValue: {
            findBySlug: jest.fn().mockResolvedValue({ data: mockBlogData }),
          },
        },
        {
          provide: StringService,
          useValue: {
            generateRandomString: jest.fn().mockReturnValue('random-slug'),
          },
        },
      ],
    }).compile();

    commentsController = module.get<CommentsController>(CommentsController);
    commentsService = module.get<CommentsService>(CommentsService);
    usersService = module.get<UsersService>(UsersService);
    blogsService = module.get<BlogsService>(BlogsService);
    stringService = module.get<StringService>(StringService);
  });

  it('should be defined', () => {
    expect(commentsController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of comments', async () => {
      const result = await commentsController.findAll();
      expect(result).toEqual([mockCommentData]);
      expect(commentsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findBySlug', () => {
    it('should return a comment by slug', async () => {
      const result = await commentsController.findBySlug('comment-slug');
      expect(result).toEqual(mockCommentData);
      expect(commentsService.findBySlug).toHaveBeenCalledWith('comment-slug');
    });
  });

  describe('create', () => {
    it('should create a comment and return the created comment', async () => {
      const createCommentDto: CreateCommentDto = { content: 'New Comment' };
      const req: any = { user: mockUserData } as any as Request;

      const result = await commentsController.create(
        { blogSlug: 'blog-slug' } as ParamCreateCommentDto,
        createCommentDto,
        req,
      );

      expect(result).toEqual(mockCommentData);
      expect(commentsService.createComment).toHaveBeenCalledWith(
        createCommentDto,
        'random-slug',
        mockUserData,
        mockBlogData,
      );
    });
  });

  describe('update', () => {
    it('should update a comment and return the updated comment', async () => {
      const updateCommentDto: UpdateCommentDto = { content: 'Updated Comment' };
      const result = await commentsController.update(
        { slug: 'comment-slug' } as ParamCommentDto,
        updateCommentDto,
      );

      expect(result).toEqual(mockCommentData);
      expect(commentsService.updateComment).toHaveBeenCalledWith(
        'comment-slug',
        updateCommentDto,
      );
    });
  });

  describe('delete', () => {
    it('should delete a comment and return the deleted comment', async () => {
      const result = await commentsController.deleteBlog({
        slug: 'comment-slug',
      } as ParamCommentDto);

      expect(result).toEqual(mockCommentData);
      expect(commentsService.deleteComment).toHaveBeenCalledWith(
        'comment-slug',
      );
    });
  });
});

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Blogs } from './entities/blog.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blogs)
    private blogsRepository: Repository<Blogs>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return {
      statusCode: 200,
      success: true,
      message: 'success',
      data: await this.blogsRepository.find({
        relations: ['user', 'comment'],
        select: {
          id: true,
          title: true,
          content: true,
          category: true,
          slug: true,
          user: {
            id: true,
            username: true,
          },
          comment: {
            id: true,
            content: true,
            user: {
              id: true,
              username: true,
            },
          },
        },
        order: {
          id: 'DESC',
          comment: {
            id: 'DESC',
          },
        },
      }),
    };
  }

  async findBySlug(slug: string) {
    const blog = await this.blogsRepository.findOne({
      where: { slug },
      relations: ['user', 'comment', 'comment.user'],
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          username: true,
        },
        comment: {
          id: true,
          content: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
          user: {
            id: true,
            username: true,
          },
        },
      },
      order: {
        id: 'DESC',
        comment: {
          id: 'DESC',
        },
      },
    });

    if (!blog) {
      return {
        statusCode: 400,
        success: false,
        message: 'This blog is not exists.',
      };
    }

    return {
      statusCode: 200,
      success: true,
      message: 'success',
      data: blog,
    };
  }

  async findByUserSlug(slug: string) {
    const blog = await this.blogsRepository.find({
      where: { user: { slug: slug } },
      relations: ['user', 'comment'],
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        slug: true,
        user: {
          id: true,
          username: true,
        },
        comment: {
          id: true,
          content: true,
          user: {
            id: true,
            username: true,
          },
        },
      },
      order: {
        id: 'DESC',
        comment: {
          id: 'DESC',
        },
      },
    });

    if (!blog) {
      return {
        statusCode: 400,
        success: false,
        message: 'This blog is not exists.',
      };
    }

    return {
      statusCode: 200,
      success: true,
      message: 'success',
      data: blog,
    };
  }

  async createBlog(blog: Partial<Blogs>, slug: string, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const blogData = this.blogsRepository.create({
        ...blog,
        slug,
        user,
      });
      await queryRunner.commitTransaction();
      return {
        statusCode: 200,
        success: true,
        message: 'created success',
        data: await this.blogsRepository.save(blogData),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        statusCode: 500,
        success: false,
        message: error.message,
      };
    }
  }

  async updateBlog(slug: string, updateData: Partial<Blogs>) {
    try {
      const blog = await this.blogsRepository.findOne({
        where: { slug },
      });

      if (blog) {
        return {
          statusCode: 200,
          success: true,
          message: 'updated success',
          data: await this.blogsRepository.update({ slug }, updateData),
        };
      }

      return {
        statusCode: 404,
        success: false,
        message: 'this blog is not exists',
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: error.message,
      };
    }
  }

  async deleteBlog(slug: string) {
    try {
      const blog = await this.blogsRepository.findOne({
        where: { slug },
      });

      if (blog) {
        return {
          statusCode: 200,
          success: true,
          message: 'deleted success',
          data: await this.blogsRepository.delete({ slug }),
        };
      }
      return {
        statusCode: 404,
        success: false,
        message: 'this blog is not exists',
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: error.message,
      };
    }
  }
}

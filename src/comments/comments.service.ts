import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comments } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { Blogs } from '../blogs/entities/blog.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return {
      statusCode: 200,
      success: true,
      message: 'success',
      data: await this.commentsRepository.find({ relations: ['user'] }),
    };
  }

  async findBySlug(slug: string) {
    const comment = await this.commentsRepository.findOne({
      where: { slug },
      relations: ['user'],
    });

    if (!comment) {
      return {
        statusCode: 404,
        success: false,
        message: 'this comment is not exists',
      };
    }

    return {
      statusCode: 200,
      success: true,
      message: 'success',
      data: comment,
    };
  }

  async createComment(
    comment: Partial<Comments>,
    slug: string,
    user: User,
    blog: Blogs,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const commentData = this.commentsRepository.create({
        ...comment,
        slug,
        user,
        blog,
      });
      await queryRunner.commitTransaction();
      return {
        statusCode: 200,
        success: true,
        message: 'created success',
        data: await this.commentsRepository.save(commentData),
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

  async updateComment(slug: string, updateData: Partial<Comments>) {
    try {
      const comment = await this.commentsRepository.findOne({
        where: { slug },
      });

      if (comment) {
        return {
          statusCode: 200,
          success: true,
          message: 'updated success',
          data: await this.commentsRepository.update({ slug }, updateData),
        };
      }

      return {
        statusCode: 500,
        success: false,
        message: 'this comment is not exists',
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: error.message,
      };
    }
  }

  async deleteComment(slug: string) {
    try {
      const comment = await this.commentsRepository.findOne({
        where: { slug },
      });

      if (comment) {
        return {
          statusCode: 200,
          success: true,
          message: 'deleted success',
          data: await this.commentsRepository.delete({ slug }),
        };
      }
      return {
        statusCode: 500,
        success: false,
        message: 'this comment is not exists',
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

import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { Blogs } from '../blogs/entities/blog.entity';
import { StringService } from '../common/utils/string.service';
import { CommentsService } from './comments.service';
import { UsersService } from '../users/users.service';
import { BlogsService } from '../blogs/blogs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comments, User, Blogs])],
  providers: [CommentsService, StringService, UsersService, BlogsService],
  controllers: [CommentsController],
})
export class CommentsModule {}

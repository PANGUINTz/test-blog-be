import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { Blogs } from './entities/blog.entity';
import { UsersService } from 'src/users/users.service';
import { StringService } from 'src/common/utils/string.service';
import { User } from 'src/users/entities/user.entity';
import { Comments } from 'src/comments/entities/comment.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([Blogs, User, Comments]), PassportModule],
  providers: [BlogsService, StringService, UsersService],
  controllers: [BlogsController],
  exports: [BlogsService],
})
export class BlogsModule {}

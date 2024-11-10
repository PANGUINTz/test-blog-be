import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import {
  CreateCommentDto,
  ParamCommentDto,
  ParamCreateCommentDto,
  UpdateCommentDto,
} from './dtos/comment.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AuthorCommentGuard, AuthorGuard } from '../auth/guards/author.guard';
import { StringService } from '../common/utils/string.service';
import { UsersService } from '../users/users.service';
import { BlogsService } from '../blogs/blogs.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly blogService: BlogsService,
    private readonly stringService: StringService,
    private readonly userService: UsersService,
    private commentsService: CommentsService,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  async findAll() {
    return await this.commentsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.commentsService.findBySlug(slug);
  }

  @UseGuards(JwtGuard)
  @Post(':blogSlug')
  @HttpCode(201)
  async create(
    @Param() params: ParamCreateCommentDto,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const userData = req['user'];

    const slug = this.stringService.generateRandomString(10);
    const user = await this.userService.findBySlug(userData.slug);
    const blog = await this.blogService.findBySlug(params.blogSlug);
    return await this.commentsService.createComment(
      createCommentDto,
      slug,
      user.data,
      blog.data,
    );
  }

  @UseGuards(JwtGuard, AuthorCommentGuard)
  @Put(':slug')
  async update(
    @Param() params: ParamCommentDto,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentsService.updateComment(
      params.slug,
      updateCommentDto,
    );
  }

  @UseGuards(JwtGuard, AuthorCommentGuard)
  @Delete(':slug')
  async deleteBlog(@Param() params: ParamCommentDto) {
    return await this.commentsService.deleteComment(params.slug);
  }
}

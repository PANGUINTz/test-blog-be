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
import { BlogsService } from './blogs.service';
import { StringService } from '../common/utils/string.service';
import { UsersService } from '../users/users.service';
import { CreateBlogDto, ParamBlogDto, UpdateBlogDto } from './dtos/blog.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AuthorGuard } from '../auth/guards/author.guard';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly stringService: StringService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  async findAll() {
    return await this.blogsService.findAll();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.blogsService.findBySlug(slug);
  }

  @UseGuards(JwtGuard)
  @Get('/user/blog')
  async findByUserSlug(@Req() req: Request) {
    const userData = req['user'];
    return await this.blogsService.findByUserSlug(userData.slug);
  }

  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(201)
  async create(@Body() createBlogDto: CreateBlogDto, @Req() req: Request) {
    const userData = req['user'];

    const slug = this.stringService.generateRandomString(10);
    const user = await this.userService.findBySlug(userData.slug);
    return await this.blogsService.createBlog(createBlogDto, slug, user.data);
  }

  @UseGuards(JwtGuard, AuthorGuard)
  @Put(':slug')
  async update(
    @Param() params: ParamBlogDto,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return await this.blogsService.updateBlog(params.slug, updateBlogDto);
  }

  @UseGuards(JwtGuard, AuthorGuard)
  @Delete(':slug')
  async deleteBlog(@Param() params: ParamBlogDto) {
    return await this.blogsService.deleteBlog(params.slug);
  }
}

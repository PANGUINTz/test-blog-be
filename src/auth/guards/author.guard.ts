import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BlogsService } from '../../blogs/blogs.service';
import { CommentsService } from '../../comments/comments.service';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(private readonly blogService: BlogsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const blogSlug = request.params.slug;

    const blog = await this.blogService.findBySlug(blogSlug);

    if (!blog) {
      throw new BadRequestException('Blog not found');
    }

    if (blog.data.user.id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to edit or delete this blog',
      );
    }

    return true;
  }
}

@Injectable()
export class AuthorCommentGuard implements CanActivate {
  constructor(private readonly commentService: CommentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request['user'], request.params.slug);

    const user = request['user'];
    const commentSlug = request.params.slug;

    const comment = await this.commentService.findBySlug(commentSlug);

    if (!comment) {
      throw new BadRequestException('comment not found');
    }

    if (comment.data.user.id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to edit or delete this comment',
      );
    }

    return true;
  }
}

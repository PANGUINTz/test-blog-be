import { IsNotEmpty, IsNumberString, IsEnum } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  content: string;
}

export class UpdateCommentDto {
  @IsNotEmpty()
  content: string;
}

export class ParamCreateCommentDto {
  @IsNotEmpty()
  blogSlug: string;
}

export class ParamCommentDto {
  @IsNotEmpty()
  slug: string;
}

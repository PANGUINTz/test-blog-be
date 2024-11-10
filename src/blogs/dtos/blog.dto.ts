import { IsNotEmpty, IsNumberString, IsEnum } from 'class-validator';
import { Category } from '../../common/enums/category.enum';

export class CreateBlogDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
  @IsEnum(Category, { message: 'category must be a valid category' })
  category: Category;
}

export class UpdateBlogDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
  @IsEnum(Category, { message: 'category must be a valid category' })
  category: Category;
}

export class ParamBlogDto {
  @IsNotEmpty()
  slug: string;
}

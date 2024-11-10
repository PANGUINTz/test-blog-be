import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Blogs } from '../../blogs/entities/blog.entity';
import { Comments } from '../../comments/entities/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  slug: string;

  @OneToMany(() => Blogs, (blog) => blog.user)
  blog: Blogs[];

  @OneToMany(() => Comments, (comment) => comment.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comment: Comments[];
}

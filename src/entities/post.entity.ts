/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.interface';
import { Category } from './category.entity';
import { Comment } from './comment.entity';
import { ImgPost } from './imgpost.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

@Entity()
export class PostEntity extends BaseEntity {
  @IsNotEmpty()
  @Column()
  title: string;

  @Column()
  @IsNotEmpty()
  content: string;

  @OneToMany(() => ImgPost, (imgpost) => imgpost.post)
  imgposts: ImgPost[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable()
  tags: Tag[];

  @ManyToMany(() => Category, (category) => category.posts)
  @JoinTable()
  categories: Category[];

  @Column({ default: false })
  published: boolean;
}

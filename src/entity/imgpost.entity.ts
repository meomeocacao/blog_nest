/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Post } from './post.entity';

@Entity()
export class ImgPost extends BaseEntity {
  @IsNotEmpty()
  url: string;

  @ManyToOne(()=> Post, post => post.imgposts)
  post: Post;
}

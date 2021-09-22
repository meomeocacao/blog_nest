/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PostEntity } from './post.entity';

@Entity()
export class Category extends BaseEntity {
  @IsNotEmpty()
  @Column()
  title: string;

  @IsNotEmpty()
  @Column()
  content: string;

  @ManyToMany(()=> PostEntity, post => post.categories,{cascade: true})
  posts: PostEntity[];
}

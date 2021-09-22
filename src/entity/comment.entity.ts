/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PostEntity } from './post.entity';

@Entity()
export class Comment extends BaseEntity {
  @IsNotEmpty()
  @Column()
  title: string;

  @IsNotEmpty()
  @Column()
  content: string;

  @Column({default: false})
  published: boolean;

  @ManyToOne(()=> PostEntity, post => post.comments)
  post: PostEntity;
}

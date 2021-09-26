/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.interface';
import { PostEntity } from './post.entity';

@Entity()
export class ImgPost extends BaseEntity {
  @Column()
  url: string;

  @ManyToOne(()=> PostEntity, post => post.imgposts, {cascade: true})
  post: PostEntity;
}

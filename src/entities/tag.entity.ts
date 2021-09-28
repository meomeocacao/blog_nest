/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.interface';
import { PostEntity } from './post.entity';

@Entity()
export class Tag extends BaseEntity {
  @IsNotEmpty()
  @Column()
  title: string;

  @IsNotEmpty()
  @Column()
  content: string;

  @ManyToMany(() => PostEntity, (post) => post.tags, {
    cascade: true,
  })
  posts: PostEntity[];
}

/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PostEntity } from './post.entity';

@Entity()
export class Tag extends BaseEntity {
  @IsNotEmpty()
  @Column()
  title: string;

  @IsNotEmpty()
  @Column()
  content: string;

  @Column({ default: false })
  published: boolean;

  @ManyToMany(() => PostEntity, (post) => post.tags, {
    cascade: true,
  })
  posts: PostEntity[];
}

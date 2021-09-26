/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.interface';
import { PostEntity } from './post.entity';

@Entity()
export class User extends BaseEntity {
  @IsNotEmpty()
  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ select: false })
  @IsNotEmpty()
  @Length(8, 12)
  password: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  profile: string;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];
  

}

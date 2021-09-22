/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PostEntity } from './post.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({ unique: true })
  @IsNotEmpty()
  username: string;

  @PrimaryColumn({ unique: true })
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

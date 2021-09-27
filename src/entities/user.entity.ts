import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.interface';
import { Comment } from './comment.entity';
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

  @Column({ default: '' })
  firstname: string;

  @Column({ default: '' })
  lastname: string;

  @Column({ default: 'My profile' })
  profile: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}

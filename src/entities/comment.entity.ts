import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.interface';
import { PostEntity } from './post.entity';
import { User } from './user.entity';

@Entity()
export class Comment extends BaseEntity {
  @IsNotEmpty()
  @Column()
  title: string;

  @IsNotEmpty()
  @Column()
  content: string;

  @Column({ default: false })
  published: boolean;

  @ManyToOne(() => PostEntity, (post) => post.comments, { cascade: true })
  post: PostEntity;

  @ManyToOne(() => User, (user) => user.comments, { cascade: true })
  user: User;
}

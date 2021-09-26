import { User } from 'src/entities/user.entity';
import { UpdateDateColumn } from 'typeorm';

export class PostDTO {
  title: string;
  content: string;
  createAt: string;
  username: string;
}

export class CreatePostDTO {
  title: string;
  content: string;
}
export class UpdatePostDTO {
  title: string;
  content: string;
}

export class FilterPostDTO{
  tag?: string;
  category?:string;
}

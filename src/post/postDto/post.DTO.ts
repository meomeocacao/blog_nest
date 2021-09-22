import { User } from 'src/entity/user.entity';
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

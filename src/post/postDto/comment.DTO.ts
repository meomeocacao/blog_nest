import { IsNotEmpty } from 'class-validator';

export class CommentDTO {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
}

export class UpdateCommentDTO {
  title: string;
  @IsNotEmpty()
  content: string;
}

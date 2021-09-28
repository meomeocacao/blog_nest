import { IsNotEmpty } from 'class-validator';

export class CommentDTO {
  title: string;
  @IsNotEmpty()
  content: string;
}

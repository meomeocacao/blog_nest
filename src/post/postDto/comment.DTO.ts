import { IsNotEmpty } from 'class-validator';

export class CommentDTO {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
}

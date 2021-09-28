import { IsNotEmpty } from 'class-validator';

export class UpdateCommentDTO {
  title: string;
  @IsNotEmpty()
  content: string;
}

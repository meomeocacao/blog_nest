import { IsNotEmpty } from 'class-validator';

export class CategoryDTO {
  title: string;
  @IsNotEmpty()
  content: string;
}

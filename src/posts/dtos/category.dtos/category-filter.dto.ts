import { IsNotEmpty } from 'class-validator';

export class CategoryFilterDTO {
  @IsNotEmpty()
  title: string;
}

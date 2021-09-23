import { IsNotEmpty } from 'class-validator';
import { PrimaryColumn } from 'typeorm';

export class CategoryDTO {
  @IsNotEmpty()
  @PrimaryColumn()
  title: string;
  @IsNotEmpty()
  content: string;
}

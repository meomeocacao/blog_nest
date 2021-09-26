import { IsNotEmpty } from 'class-validator';
import { PrimaryColumn } from 'typeorm';

export class CategoryDTO {
  @PrimaryColumn()
  title: string;
  @IsNotEmpty()
  content: string;
}

export class CategoryFilterDTO{
  @IsNotEmpty()
  title: string;
}

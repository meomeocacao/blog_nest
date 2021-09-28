import { IsString } from 'class-validator';
import { PrimaryColumn } from 'typeorm';

export class TagDTO {
  @IsString()
  tag: string;
  content: string;
}

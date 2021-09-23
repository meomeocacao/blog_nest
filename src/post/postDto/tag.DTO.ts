import { PrimaryColumn } from 'typeorm';

export class TagDTO {
  @PrimaryColumn()
  tag: string;
  content: string;
}

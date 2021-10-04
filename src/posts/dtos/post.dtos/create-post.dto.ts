import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDTO {
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
  // @ApiProperty()
  // urlImg?: string;
  @ApiProperty()
  tag?: string[];
  @ApiProperty()
  category?: string[];
}

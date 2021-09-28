export class PostDTO {
  title: string;
  content: string;
  createAt: string;
  username: string;
}

export class CreatePostDTO {
  title: string;
  content: string;
  urlImg?: string;
  tag?: string[];
  category?: string[];
}
export class UpdatePostDTO {
  title: string;
  content: string;
  urlImg?: string;
  tag?: string;
  category?: string;
}

export class FilterPostDTO {
  tag?: string;
  category?: string;
}

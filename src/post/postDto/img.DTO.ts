import { IsFQDN } from 'class-validator';

export class ImgDTO {
  @IsFQDN()
  url: string;
  title: string;
}

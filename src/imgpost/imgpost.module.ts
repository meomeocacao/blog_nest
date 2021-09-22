import { Module } from '@nestjs/common';
import { ImgpostController } from './imgpost.controller';
import { ImgpostService } from './imgpost.service';

@Module({
  controllers: [ImgpostController],
  providers: [ImgpostService]
})
export class ImgpostModule {}

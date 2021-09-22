import { Module } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [UserRepository],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}

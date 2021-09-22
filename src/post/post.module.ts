import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { ImgPost } from 'src/entity/imgpost.entity';
import { Tag } from 'src/entity/tag.entity';
import { User } from 'src/entity/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository, User, Comment, Tag, ImgPost]),
    UserModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}

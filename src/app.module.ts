import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ImgpostModule } from './imgpost/imgpost.module';
import { CommentModule } from './comment/comment.module';
import { TagModule } from './tag/tag.module';
import { CategoryModule } from './category/category.module';
import { User } from './entity/user.entity';
import { Comment } from './entity/comment.entity';
import { ImgPost } from './entity/imgpost.entity';
import { PostEntity } from './entity/post.entity';
import { Tag } from './entity/tag.entity';
import { Category } from './entity/category.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: '123123',
      database: 'blog_nest',
      // autoLoadEntities: true,
      // entities: [User, Comment, ImgPost, PostEntity, Tag, Category],
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    PostModule,
    ImgpostModule,
    CommentModule,
    TagModule,
    CategoryModule,
    AuthModule,
  ],
})
export class AppModule {}

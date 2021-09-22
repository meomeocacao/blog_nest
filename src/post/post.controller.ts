import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Comment } from 'src/entity/comment.entity';
import { PostEntity } from 'src/entity/post.entity';
import { PostService } from './post.service';
import { CommentDTO, UpdateCommentDTO } from './postDto/comment.DTO';
import { ImgDTO } from './postDto/img.DTO';
import { CreatePostDTO, UpdatePostDTO } from './postDto/post.DTO';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  // GET post/:postId
  @Get('/:postId')
  async getPostById(@Param('postId') postId: string): Promise<PostEntity> {
    return await this.postService.getPost(postId);
  }
  // POST post/:userId
  @Post('/:userId')
  async createPost(
    @Param('userId') userId: string,
    @Body() newPost: CreatePostDTO,
  ): Promise<PostEntity> {
    return await this.postService.createNewPost(userId, newPost);
  }

  //   GET post/:userId
  @Get('/:userId')
  async getPostByUser(@Param('userId') userId: string): Promise<PostEntity[]> {
    return await this.postService.getPostByUser(userId);
  }
  //   GET all post post/
  @Get()
  async getAllPost(): Promise<PostEntity[]> {
    return await this.postService.getPostByUser('');
  }
  //   DELETE post from user
  @Delete('/:userId/:postId')
  async delPostFromUser(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<string> {
    return await this.postService.delPostByUser(userId, postId);
  }
  //   PATCH post from user
  @Patch('/:userId/:postId')
  async updatePostFromUser(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDTO,
  ): Promise<PostEntity> {
    return await this.postService.updatePostByUser(
      userId,
      postId,
      updatePostDto,
    );
  }
  // POST post/:postId/:userId
  @Post('/:postId/cmt')
  async addComment(
    @Param('postId') postId: string,
    @Body() newCmt: CommentDTO,
  ): Promise<PostEntity> {
    return await this.postService.addComment(postId, newCmt);
  }
  // POST post/:postId
  @Post('/:postId/img')
  async addImg(
    @Param('postId') postId: string,
    @Body() newImg: ImgDTO,
  ): Promise<PostEntity> {
    return await this.postService.addImg(postId, newImg);
  }
  // PATCH post/:cmtId
  @Patch('/cmt:cmtId')
  async updateCmt(
    @Param('cmtId') cmtId: string,
    @Body() updateCmt: UpdateCommentDTO,
  ): Promise<PostEntity> {
    return await this.postService.updateComment(cmtId, updateCmt);
  }
}

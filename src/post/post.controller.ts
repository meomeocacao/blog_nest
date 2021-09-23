import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Category } from 'src/entity/category.entity';
import { Comment } from 'src/entity/comment.entity';
import { PostEntity } from 'src/entity/post.entity';
import { Tag } from 'src/entity/tag.entity';
import { PostService } from './post.service';
import { CategoryDTO } from './postDto/category.DTO';
import { CommentDTO, UpdateCommentDTO } from './postDto/comment.DTO';
import { ImgDTO } from './postDto/img.DTO';
import { CreatePostDTO, UpdatePostDTO } from './postDto/post.DTO';
import { TagDTO } from './postDto/tag.DTO';

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
  @Get('/user/:userId')
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
  // PATCh soft delete post
  @Patch('/del/:userId/:postId')
  async softDelPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<string> {
    return await this.postService.solfDelPost(userId, postId);
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
  // GET post/:postId/cmt
  @Get('/:postId/cmt')
  async getCmtByPost(@Param('postId') postId: string): Promise<Comment[]> {
    return await this.postService.getComment(postId);
  }
  // POST post/:postId/tag
  @Post('/:postId/tag')
  async addTagToPost(
    @Param('postId') postId: string,
    @Body() addTag: TagDTO,
  ): Promise<PostEntity> {
    return await this.postService.addTagToPost(postId, addTag);
  }
  // POST post/:postId/cate
  @Post(':/postId/cate')
  async addCateToPost(
    @Param('postId') postId: string,
    @Body() cateTitle: string,
  ): Promise<PostEntity> {
    return await this.postService.addCateToPost(postId, cateTitle);
  }
  // POST post/cate
  @Post('/addcate/add')
  async addCate(@Body() newCate: CategoryDTO): Promise<Category[]> {
    console.log('*');

    return await this.postService.addCategory(newCate);
  }
  // POST post/cate
  @Get('/addcate/add')
  async getAllCate(): Promise<Category[]> {
    return await this.postService.addCategory(null);
  }
}

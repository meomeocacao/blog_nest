import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Category } from 'src/entities/category.entity';
import { Comment } from 'src/entities/comment.entity';
import { PostEntity } from 'src/entities/post.entity';
import { PostService } from './post.service';
import { CategoryDTO, CategoryFilterDTO } from './dtos/category.dto';
import { CommentDTO, UpdateCommentDTO } from './dtos/comment.dto';
import { CreatePostDTO, FilterPostDTO, UpdatePostDTO } from './dtos/post.dto';
import { TagDTO } from './dtos/tag.dto';
import { extname } from 'path';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AllowAny } from 'src/auth/decorators/allowany.decorator';

export const multerOptions = {
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: process.env.UPLOAD_LOCATION,
    // destination: process.env.UPLOAD_LOCATION,
    filename: (req, file, cb) => {
      const filename = `${Date.now()}.${extname(file.originalname)}`;
      // const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}`);
      // cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('post')
@UseGuards(LocalAuthGuard, RolesGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}
  urlImage(filename) {
    return `${process.env.UPLOAD_LOCATION}${filename}`;
  }
  //   GET all post post/
  @Get()
  async getAllPost(): Promise<PostEntity[]> {
    console.log('Get all post');

    return await this.postService.getAllPost();
  }
  // GET post/:postId
  @Get('/:postId')
  async getPostById(@Param('postId') postId: string): Promise<PostEntity> {
    console.log('Get post id');

    return await this.postService.getPostById(postId);
  }
  //   GET post/:userId
  @Get('/user/:userId')
  async getPostByUser(@Param('userId') userId: string): Promise<PostEntity[]> {
    console.log('Get all post by user');

    return await this.postService.getAllPostByUser(userId);
  }
  // POST post/:userId
  @Post('/:userId')
  async createPost(
    @Param('userId') userId: string,
    @Body() newPost: CreatePostDTO,
  ): Promise<PostEntity> {
    console.log('Create post');

    return await this.postService.createNewPost(userId, newPost);
  }

  // PATCH soft delete post
  @Patch('/:postId/delete')
  async softDelPost(@Param('postId') postId: string): Promise<string> {
    console.log('Soft Delete post');

    return await this.postService.softDelPostById(postId);
  }
  //   PATCH post from user
  @Patch('/:postId/update')
  async updatePostFromUser(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDTO,
  ): Promise<PostEntity> {
    console.log('Update post');

    return await this.postService.updatePostById(postId, updatePostDto);
  }

  /*
    Comment 
    */

  // GET post/:postId/cmt
  @Get('/:postId/cmt')
  @AllowAny()
  async getCmtByPost(
    @Param('postId') postId: string,
    @Request() request,
  ): Promise<Comment[]> {
    console.log('Get comment by post');

    request.user;

    return await this.postService.getCommentByPostId(postId);
  }
  // POST post/:postId/cmt
  @Post('/:postId/cmt')
  async addComment(
    @Param('postId') postId: string,
    // @Param('userId') userId: string,
    @Body() newCmt: CommentDTO,
  ): Promise<PostEntity> {
    console.log('Add comment to post');
    return await this.postService.addComment(postId, newCmt);
  }
  // PATCH post/:cmtId
  @Patch('/cmt/:cmtId')
  async updateCmt(
    @Param('cmtId') cmtId: string,
    @Body() updateCmt: UpdateCommentDTO,
  ): Promise<PostEntity> {
    console.log('Update comment from post');

    return await this.postService.updateComment(cmtId, updateCmt);
  }

  /*
  Tag
  */

  // POST post/:postId/tag
  @Post('/:postId/tag')
  async addTagToPost(
    @Param('postId') postId: string,
    @Body() addTag: TagDTO,
  ): Promise<PostEntity> {
    console.log('Add tag to post');

    return await this.postService.addTagToPost(postId, addTag);
  }

  /*
  Category
  */
  // GET post/cate
  @Get('/category/get')
  async getAllCate(): Promise<Category[]> {
    console.log('Get  all category');

    return await this.postService.getAllCate();
  }

  // GET post/cagegory/:postId
  @Get('/category/:postId')
  async getCateByPostId(@Param('postId') postId: string): Promise<Category[]> {
    console.log('Get all cate from post');

    return await this.postService.getCateByPostId(postId);
  }

  // PATCH post/category/:postId/:cateId
  @Patch('/category/:postId/:cateId')
  async deleteCateByPostId(
    @Param('postId') postId: string,
    @Param('cateId') cateId: string,
  ): Promise<PostEntity> {
    console.log('Delete category of post');

    return await this.postService.deleteCateByPostId(postId, cateId);
  }
  // PATCH post/category/:postId
  @Patch('category/:postId')
  async deleteAllCateByPostId(
    @Param('postId') postId: string,
  ): Promise<PostEntity> {
    console.log('Delete all category of post');
    return await this.deleteAllCateByPostId(postId);
  }

  // POST post/:postId/cate
  @Post('/category/add/:postId')
  async addCateToPost(
    @Param('postId') postId: string,
    @Body() cateTitle: CategoryFilterDTO,
  ): Promise<PostEntity> {
    console.log('Add category to post');

    return await this.postService.addCateToPost(postId, cateTitle.title);
  }
  // POST post/cate
  @Post('/category/add')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  async addCate(@Body() newCate: CategoryDTO): Promise<Category[]> {
    console.log('Add category');

    return await this.postService.addCategory(newCate);
  }

  /*
  Image
  */

  //POST /post/image/:postId/
  @Post('/image/:postId')
  @UseInterceptors(FileInterceptor('photo', multerOptions))
  async uploadPostImg(
    @UploadedFile() file,
    @Param('postId') postId: string,
  ): Promise<PostEntity> {
    console.log('Upload image to post');

    const url: string = process.env.UPLOAD_LOCATION + file.filename;
    await this.postService.addImgToPost(url, postId);
    return await this.postService.getPostById(postId);
  }

  // PATCH post/image/:postId
  @Patch('/image/:postId/:imgId')
  async deleteImgByPostId(
    @Param('postId') postId: string,
    @Param('imgId') imgId: string,
  ): Promise<PostEntity> {
    console.log('Delete img by post');
    return this.postService.deleteImgByPostId(postId, imgId);
  }

  //PATCH post/image/:postId
  @Patch('image/:postId')
  async deleteAllImageByPostId(
    @Param('postId') postId: string,
  ): Promise<PostEntity> {
    await this.postService.deleteAllImgByPostId(postId);
    return this.postService.getPostById(postId);
  }

  // filter post by tag/ category
  @Get('/filter/query')
  async getPostByFilter(
    @Query() filterDto: FilterPostDTO,
  ): Promise<PostEntity[]> {
    console.log('Filter post follow tag/ category');

    return await this.postService.filterPost(filterDto);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Comment } from 'src/entities/comment.entity';
import { ImgPost } from 'src/entities/imgpost.entity';
import { PostEntity } from 'src/entities/post.entity';
import { Tag } from 'src/entities/tag.entity';
import { User } from 'src/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { PostRepository } from './post.repository';
import { CategoryDTO } from './dtos/category.dto';
import { CommentDTO, UpdateCommentDTO } from './dtos/comment.dto';
import { CreatePostDTO, FilterPostDTO, UpdatePostDTO } from './dtos/post.dto';
import { TagDTO } from './dtos/tag.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(ImgPost)
    private readonly imgPostRepository: Repository<ImgPost>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Category)
    private readonly cateRepository: Repository<Category>,
  ) {}
  // get user by querystring
  getUser(queryString: string): Promise<User | undefined> {
    return this.userRepository
      .createQueryBuilder('user')
      .andWhere(
        new Brackets((qb) => {
          qb.where('user.username = :username', { username: queryString })
            .orWhere('user.email = :email', { email: queryString })
            .orWhere('user.id = :id', { id: queryString });
        }),
      )
      .getOne();
  }

  // get tag by title
  checkExistTag(tag_title: string): Promise<Tag | undefined> {
    return this.tagRepository.findOne({ title: tag_title });
  }

  // get cate by title
  checkExistCate(cate_title: string): Promise<Category | undefined> {
    return this.cateRepository.findOne({ title: cate_title });
  }
  // create new Post
  async createNewPost(
    userId: string,
    newPost: CreatePostDTO,
  ): Promise<PostEntity | undefined> {
    const user = await this.getUser(userId);
    // const cate = await this.checkExistCate(newPost.category);
    // const tag = await this.checkExistTag(newPost.tag);
    const post = await this.postRepository.create({ ...newPost, user: user });
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'posts')
      .of(user)
      .add(post);
    return await this.postRepository.save(post);
  }

  // get post by id
  getPostById(id: string): Promise<PostEntity | undefined> {
    return this.postRepository.getPostById(id);
  }

  // get all post
  getAllPost(): Promise<PostEntity[]> {
    return this.postRepository.getAllPost();
  }

  // get all post from user
  async getAllPostByUser(userId: string): Promise<PostEntity[]> {
    const user = await this.getUser(userId);
    return await this.postRepository.getAllPostByUser(user.id);
  }
  // softdelete post
  async softDelPostById(postId: string): Promise<string> {
    await this.postRepository.update({ id: postId }, { isDelete: true });
    return `Deleted`;
  }

  // update post by Id
  async updatePostById(
    postId: string,
    newPost: UpdatePostDTO,
  ): Promise<PostEntity | undefined> {
    await this.postRepository.updatePostById(postId, newPost);
    return await this.postRepository.getPostById(postId);
  }

  // create comment
  createComment(newComment: CommentDTO, post: PostEntity) {
    return this.commentRepository.save({ ...newComment, post });
  }

  // add comment
  async addComment(
    postId: string,
    newComment: CommentDTO,
  ): Promise<PostEntity | undefined> {
    const post = await this.postRepository.getPostById(postId);
    const cmt = await this.createComment(newComment, post);
    this.postRepository.addCommentToPost(post, cmt);
    return this.postRepository.getPostById(postId);
  }
  // update comment
  async updateComment(
    cmtId: string,
    updateCmt: UpdateCommentDTO,
  ): Promise<PostEntity> {
    await this.commentRepository.update(
      { id: cmtId },
      { title: updateCmt.title, content: updateCmt.content },
    );
    return this.postRepository.getPostByCmt(cmtId);
  }

  // delete comment
  async delComment(cmtId: string): Promise<string> {
    await this.commentRepository.update({ id: cmtId }, { isDelete: true });
    return `Deleted`;
  }

  // add img to server
  async addImgToPost(
    url: string,
    postId: string,
  ): Promise<PostEntity | undefined> {
    const post = await this.postRepository.getPostById(postId);
    await this.imgPostRepository.save({ url, post: post });
    return post;
  }
  // delete img from post
  async deleteImgByPostId(
    postId: string,
    imgId: string,
  ): Promise<PostEntity | undefined> {
    const post = await this.postRepository.getPostByIdWithImgId(imgId, postId);
    post.imgposts = post.imgposts.filter((img) => img.id != imgId);
    await this.postRepository.update(
      { id: postId },
      { imgposts: post.imgposts },
    );
    return post;
  }
  // delete all img from post
  async deleteAllImgByPostId(postId: string) {
    this.postRepository.update({ id: postId }, { imgposts: [] });
  }

  // get comment by post id
  getCommentByPostId(postId: string): Promise<Comment[]> {
    return this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.post', 'post')
      .where(`post.id=:postId`, { postId: postId })
      .andWhere(`post.isDelete = false`)
      .andWhere(`comment.isDelete = false`)
      .getMany();
  }
  // add tag to post
  async addTagToPost(
    postId: string,
    newTag: TagDTO,
  ): Promise<PostEntity | undefined> {
    const tag = await this.tagRepository.findOne({
      where: { tag: newTag.tag },
    });
    const post = await this.postRepository.getPostById(postId);
    await post.tags.push(tag);
    await this.postRepository.update({ id: postId }, { tags: post.tags });
    return post;
  }
  // add category to post
  async addCateToPost(
    postId: string,
    cateTitle: string,
  ): Promise<PostEntity | undefined> {
    const post = await this.postRepository.getPostById(postId);
    const category = await this.cateRepository.findOne({
      where: {
        title: cateTitle,
      },
    });
    post.categories.push(category);
    await this.postRepository.update(
      { id: postId },
      { categories: post.categories },
    );
    return post;
  }

  // add category to category
  async addCategory(newCate: CategoryDTO): Promise<Category[]> {
    // add category
    await this.cateRepository.save(newCate);
    return await this.cateRepository.find();
  }
  // get all category from post
  async getCateByPostId(postId: string): Promise<Category[]> {
    const categories = await this.cateRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.posts', 'post')
      .where(`post.id = :postId`, { postId: postId })
      .andWhere('post.isDelete =false')
      .getMany();
    return categories;
  }
  // get all category
  async getAllCate() {
    return this.cateRepository.find();
  }
  // delete category from post
  async deleteCateByPostId(
    postId: string,
    cateId: string,
  ): Promise<PostEntity | undefined> {
    const post = await this.postRepository.getPostByIdWithCateId(
      postId,
      cateId,
    );
    post.categories = post.categories.filter(
      (category) => category.id != cateId,
    );
    this.postRepository.update({ id: postId }, { categories: post.categories });
    return post;
  }
  // delete all category from post
  async deleteAllCateByPostId(postId: string): Promise<PostEntity | undefined> {
    await this.postRepository.deleteAllCategory(postId);
    return this.postRepository.getPostById(postId);
  }
  // filter post
  async filterPost(filterDto: FilterPostDTO): Promise<PostEntity[]> {
    return await this.postRepository.getPostByFilter(filterDto);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Comment } from 'src/entities/comment.entity';
import { ImgPost } from 'src/entities/imgpost.entity';
import { PostEntity } from 'src/entities/post.entity';
import { Tag } from 'src/entities/tag.entity';
import { User } from 'src/entities/user.entity';
import { Brackets, In, Repository } from 'typeorm';
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
  checkExistTag(tag_title: string): Promise<Tag> {
    return this.tagRepository.findOne({ title: tag_title });
  }

  // get tag from array
  getArrTag(tag_title: string[]): Promise<Tag[]> {
    return this.tagRepository.find({
      where: {
        title: In(tag_title),
      },
    });
  }

  // get category from array
  getArrCate(cate_title: string[]): Promise<Tag[]> {
    return this.cateRepository.find({
      where: { title: In(cate_title) },
    });
  }
  // get cate by title
  checkExistCate(cate_title: string): Promise<Category | undefined> {
    return this.cateRepository.findOne({ title: cate_title });
  }
  // create new Post
  async createNewPost(
    currUser: User,
    newPost: CreatePostDTO,
  ): Promise<PostEntity | undefined> {
    const user = await this.getUser(currUser.id);
    const tags = await this.getArrTag(newPost.tag);
    console.log(tags);
    const categories = await this.getArrCate(newPost.category);
    const { category, tag, ...formattedNewPost } = newPost;
    return await this.postRepository.save({
      ...formattedNewPost,
      user,
      categories,
      tags,
    });
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
  async getAllPostByUser(user: User): Promise<PostEntity[]> {
    return await this.postRepository.find({ user });
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
  async createComment(
    newComment: CommentDTO,
    post: PostEntity,
    currUser: User,
  ) {
    const user = await this.getUser(currUser.id);
    return await this.commentRepository.save({ ...newComment, post, user });
  }

  // add comment
  async addComment(
    postId: string,
    newComment: CommentDTO,
    currUser: User,
  ): Promise<PostEntity | undefined> {
    const user = await this.getUser(currUser.id);
    const post = await this.postRepository.getPostById(postId);
    const cmt = await this.createComment(newComment, post, user);
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
      .where(`post.id=:postId`, { postId })
      .andWhere(`post.isDelete = false`)
      .andWhere(`comment.isDelete = false`)
      .getMany();
  }

  // delete comment by id
  async deleteCmt(cmtId: string): Promise<any> {
    await this.commentRepository.update(cmtId, { isDelete: true });
    return `Comment deleted!`;
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
  async addCategory(newCate: CategoryDTO): Promise<Category | undefined> {
    // check exist
    const cate = await this.cateRepository.findOne({ title: newCate.title });
    if (cate) return cate;
    // add category
    return await this.cateRepository.save(newCate);
  }
  // get all category from post
  async getCateByPostId(postId: string): Promise<Category[]> {
    const categories = await this.cateRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.posts', 'post')
      .where(`post.id = :postId`, { postId })
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
    return await this.postRepository.getPostById(postId);
  }
  // filter post
  async filterPost(filterDto: FilterPostDTO): Promise<PostEntity[]> {
    return await this.postRepository.getPostByFilter(filterDto);
  }
}

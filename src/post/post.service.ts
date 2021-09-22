import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { ImgPost } from 'src/entity/imgpost.entity';
import { PostEntity } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { PostRepository } from './post.repository';
import { CommentDTO, UpdateCommentDTO } from './postDto/comment.DTO';
import { ImgDTO } from './postDto/img.DTO';
import { CreatePostDTO, UpdatePostDTO } from './postDto/post.DTO';

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
  ) {}
  //   get user by id/email/username
  async getUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [
        {
          username: userId,
          isDelete: false,
        },
        { email: userId, isDelete: false },
        {
          id: userId,
          isDelete: false,
        },
      ],
      relations: ['posts'],
    });
    if (!user) throw new NotFoundException(`Not found user with ${userId}`);
    return user;
  }

  // get post by id
  async getPost(postId: string): Promise<PostEntity> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);
    return post;
  }
  // create new Post
  async createNewPost(
    userId: string,
    newPost: CreatePostDTO,
  ): Promise<PostEntity> {
    const user = await this.getUser(userId);

    const post = await this.postRepository.save({ ...newPost, user });
    // user.posts.push(post);
    await this.userRepository.save(user);
    await this.postRepository.save(post);
    return post;
  }

  //   get post by userid
  async getPostByUser(userId: string | null): Promise<PostEntity[]> {
    if (!userId) return await this.postRepository.getAllPost();
    const user = await this.getUser(userId);
    const posts = await this.postRepository.getAllPostByUser(user);
    if (posts.length > 0) {
      return posts;
    }
    throw new NotFoundException(`User ${user.username} not have any post`);
  }
  // delete post
  async delPostByUser(userId: string, postId: string): Promise<string> {
    const user = await this.getUser(userId);
    const post = await this.postRepository.getPostFromUser(user, postId);
    if (!post) throw new NotFoundException(`Not found post ID ${postId}`);
    await this.postRepository.softDelete(post);
    return `Deleted post`;
  }
  //   update post
  async updatePostByUser(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostDTO,
  ): Promise<PostEntity> {
    const user = await this.getUser(userId);
    const post = await this.postRepository.getPostFromUser(user, postId);
    if (!post) throw new NotFoundException(`Not found post ID ${postId}`);
    const updated = Object.assign(post, updatePostDto);
    return await this.postRepository.save(updated);
  }
  // add comment
  async addComment(
    postId: string,
    newComment: CommentDTO,
  ): Promise<PostEntity> {
    const post = await this.getPost(postId);
    const comment = await this.commentRepository.save(newComment);
    post.comments.push(comment);
    await this.postRepository.save(post);

    return post;
  }
  // update comment
  async updateComment(
    cmtId: string,
    updateCmt: UpdateCommentDTO,
  ): Promise<PostEntity> {
    const comment = await this.commentRepository.findOne({
      where: { id: cmtId },
      relations: ['post'],
    });
    if (!comment)
      throw new NotFoundException(`Comment with ID ${cmtId} not found `);
    comment.title = updateCmt.title || comment.title;
    comment.content = updateCmt.content;
    // const updated = await this.commentRepository.findOne({ id: cmtId });
    await this.commentRepository.save(comment);
    return this.getPost(comment.post.id);
  }

  // delete comment
  async delComment(postId: string, cmtId: string): Promise<PostEntity> {
    const post = await this.getPost(postId);
    const comment = await this.commentRepository.findOne({
      where: [{ id: cmtId }, { isDelete: false }],
    });
    if (!comment)
      throw new NotFoundException(`Comment with ID ${cmtId} not found`);
    comment.isDelete = true;
    await this.postRepository.save(post);
    return post;
  }
  // add img
  async addImg(postId: string, newImg: ImgDTO): Promise<PostEntity> {
    const post = await this.getPost(postId);
    const img = await this.imgPostRepository.save({ ...newImg, post });
    await this.postRepository.save(post);
    await this.imgPostRepository.save(img);
    return post;
  }
}

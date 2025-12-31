import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "./entities/comment.entity";
import { RedisService } from "@/common/redis/redis.service";
import { ArticleService } from "../article/article.service";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private redisService: RedisService,
    private articleService: ArticleService
  ) {}

  /**
   * 创建评论
   */
  async create(
    content: string,
    author: string,
    articleId: number,
    userId: number,
    parentId?: number | null,
    avatar?: string
  ) {
    // 验证文章是否存在
    await this.articleService.findOne(articleId);

    // 添加调试日志，查看准备保存的评论数据
    console.log("准备保存的评论数据:", {
      content,
      author,
      articleId,
      userId,
      parentId,
      avatar,
    });

    // 使用QueryBuilder直接执行INSERT语句，绕过实体元数据
    const result = await this.commentRepository
      .createQueryBuilder()
      .insert()
      .into(Comment)
      .values({
        content,
        author,
        articleId,
        userId,
        parentId,
        avatar,
      })
      .execute();

    // 获取插入的评论ID
    const commentId = result.identifiers[0].id;

    // 查询刚插入的评论，包括avatar字段
    const savedComment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ["user"], // 同时获取关联的用户信息
    });

    // 添加调试日志，查看保存后的评论数据
    console.log("保存后的评论数据:", savedComment);

    // 清除缓存
    await this.redisService.del(`comments:article:${articleId}`);

    return savedComment;
  }

  /**
   * 获取文章评论列表
   */
  async findByArticleId(articleId: number) {
    const cacheKey = `comments:article:${articleId}`;

    // 尝试从缓存获取，如果失败则直接从数据库查询
    try {
      const cached = await this.redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Redis缓存获取失败:", error);
    }

    // 获取所有评论，包括回复和用户信息（用于获取头像）
    const comments = await this.commentRepository.find({
      where: { articleId },
      order: { createdAt: "DESC" },
      relations: ["replies", "user", "replies.user"],
    });

    // 将评论转换为树形结构
    const rootComments: Comment[] = [];
    const commentMap = new Map<number, Comment>();

    // 首先将所有评论添加到映射中
    comments.forEach((comment) => {
      commentMap.set(comment.id, comment);
    });

    // 然后构建树形结构
    comments.forEach((comment) => {
      if (!comment.parentId) {
        // 根评论
        rootComments.push(comment);
      } else {
        // 回复
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(comment);
        }
      }
    });

    // 尝试缓存结果，如果失败则忽略
    try {
      // 缓存1小时
      await this.redisService.set(cacheKey, JSON.stringify(rootComments), 3600);
    } catch (error) {
      console.error("Redis缓存设置失败:", error);
    }

    return rootComments;
  }

  /**
   * 删除评论
   */
  async remove(id: number, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id, userId },
    });

    if (!comment) {
      throw new NotFoundException("评论不存在或无权限删除");
    }

    await this.commentRepository.remove(comment);

    // 清除缓存
    await this.redisService.del(`comments:article:${comment.articleId}`);

    return { message: "删除成功" };
  }

  /**
   * 切换评论点赞状态
   */
  async toggleLike(commentId: number, userId: number = 0) {
    // 获取评论
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException("评论不存在");
    }

    // 切换点赞状态
    comment.liked = !comment.liked;
    comment.likes += comment.liked ? 1 : -1;

    // 保存更新后的评论
    const updatedComment = await this.commentRepository.save(comment);

    // 清除缓存
    await this.redisService.del(`comments:article:${updatedComment.articleId}`);

    return {
      id: updatedComment.id,
      liked: updatedComment.liked,
      likes: updatedComment.likes,
    };
  }
}

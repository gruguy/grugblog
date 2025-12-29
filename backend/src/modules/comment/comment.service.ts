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
    parentId?: number | null
  ) {
    // 验证文章是否存在
    await this.articleService.findOne(articleId);

    const comment = this.commentRepository.create({
      content,
      author,
      articleId,
      userId,
      parentId,
    });

    const savedComment = await this.commentRepository.save(comment);

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

    // 获取所有评论，包括回复
    const comments = await this.commentRepository.find({
      where: { articleId },
      order: { createdAt: "DESC" },
      relations: ["replies"],
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
}

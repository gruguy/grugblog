import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Article } from "./entities/article.entity";
import { Category } from "./entities/category.entity";
import { Tag } from "./entities/tag.entity";
import { ArticleCollect } from "./entities/collect.entity";
import { ArticleLike } from "./entities/like.entity";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { RedisService } from "@/common/redis/redis.service";
import { MusicService } from "../music/music.service";
import { ImageService } from "../image/image.service";
import { VideoService } from "../video/video.service";

console.log("ArticleService - 正在加载...");

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(ArticleCollect)
    private articleCollectRepository: Repository<ArticleCollect>,
    @InjectRepository(ArticleLike)
    private articleLikeRepository: Repository<ArticleLike>,
    private redisService: RedisService,
    private musicService: MusicService,
    private imageService: ImageService,
    private videoService: VideoService
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articleRepository.create(createArticleDto);

    if (createArticleDto.categoryId) {
      article.category = await this.categoryRepository.findOne({
        where: { id: createArticleDto.categoryId },
      });
    }

    if (createArticleDto.tagIds && createArticleDto.tagIds.length > 0) {
      article.tags = await this.tagRepository.find({
        where: createArticleDto.tagIds.map((id) => ({ id })),
      });
    }

    const savedArticle = await this.articleRepository.save(article);

    // 清除缓存
    await this.redisService.del("articles:list:*");
    await this.redisService.del("articles:activity_v2:*");

    return savedArticle;
  }

  async findAll(page = 1, size = 10, categoryId?: number, tagId?: number) {
    const cacheKey = `articles:list:${page}:${size}:${categoryId || ""}:${tagId || ""}`;

    // 尝试从缓存获取，如果失败则直接从数据库查询
    try {
      const cached = await this.redisService.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Redis缓存获取失败:", error);
    }

    const queryBuilder = this.articleRepository
      .createQueryBuilder("article")
      .leftJoinAndSelect("article.category", "category")
      .leftJoinAndSelect("article.tags", "tags")
      .leftJoinAndSelect("article.author", "author")
      .orderBy("article.createdAt", "DESC");

    if (categoryId) {
      queryBuilder.where("article.categoryId = :categoryId", { categoryId });
    }

    if (tagId) {
      queryBuilder
        .innerJoin("article.tags", "tag")
        .andWhere("tag.id = :tagId", { tagId });
    }

    const [list, total] = await queryBuilder
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();

    const result = {
      list,
      total,
      page,
      size,
    };

    // 尝试缓存结果，如果失败则忽略
    try {
      // 缓存1小时
      await this.redisService.set(cacheKey, JSON.stringify(result), 3600);
    } catch (error) {
      console.error("Redis缓存设置失败:", error);
    }

    return result;
  }

  async findOne(id: number): Promise<Article> {
    console.log(`查找文章ID: ${id}`);

    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ["category", "tags", "author"],
    });

    if (!article) {
      console.log(`文章ID: ${id} 不存在`);
      throw new NotFoundException("文章不存在");
    }

    // 增加访问量
    article.views += 1;
    // 保存时只更新views字段，避免categoryId被设置为null
    await this.articleRepository.update(id, { views: article.views });

    return article;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto
  ): Promise<Article> {
    // 构建要更新的字段对象
    const updateFields: any = {};

    if (updateArticleDto.title !== undefined) {
      updateFields.title = updateArticleDto.title;
    }
    if (updateArticleDto.content !== undefined) {
      updateFields.content = updateArticleDto.content;
    }
    if (updateArticleDto.summary !== undefined) {
      updateFields.summary = updateArticleDto.summary;
    }
    if (updateArticleDto.cover !== undefined) {
      updateFields.cover = updateArticleDto.cover;
    }
    if (updateArticleDto.status !== undefined) {
      updateFields.status = updateArticleDto.status;
    }
    if (updateArticleDto.categoryId !== undefined) {
      updateFields.categoryId = updateArticleDto.categoryId;
    }

    // 只更新提供的字段
    if (Object.keys(updateFields).length > 0) {
      await this.articleRepository.update(id, updateFields);
    }

    // 处理tags关系
    if (updateArticleDto.tagIds) {
      const article = await this.articleRepository.findOne({
        where: { id },
        relations: ["tags"],
      });
      if (article) {
        article.tags = await this.tagRepository.find({
          where: updateArticleDto.tagIds.map((id) => ({ id })),
        });
        await this.articleRepository.save(article);
      }
    }

    // 清除缓存
    await this.redisService.del("articles:list:*");
    await this.redisService.del(`article:${id}`);
    await this.redisService.del("articles:activity_v2:*");

    // 返回更新后的文章
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const article = await this.findOne(id);
    await this.articleRepository.remove(article);

    // 清除缓存
    await this.redisService.del("articles:list:*");
    await this.redisService.del(`article:${id}`);
    await this.redisService.del("articles:activity_v2:*");
  }

  /**
   * 获取所有文章分类，包含文章数量
   */
  async getCategories() {
    const cacheKey = "articles:categories";

    // 清除旧缓存，确保返回新数据
    try {
      await this.redisService.del(cacheKey);
      console.log("已清除旧的分类缓存");
    } catch (error) {
      console.error("清除旧缓存失败:", error);
    }

    // 直接从数据库查询，不使用缓存
    const categories = await this.categoryRepository.find({
      order: { id: "DESC" },
    });

    // 统计每个分类的文章数量
    for (const category of categories) {
      // 使用TypeORM的count方法获取文章数量
      const articleCount = await this.articleRepository.count({
        where: { categoryId: category.id },
      });
      // 将articleCount添加到分类对象中
      (category as any).articleCount = articleCount;
    }

    // 缓存新结果
    try {
      // 缓存24小时
      await this.redisService.set(cacheKey, JSON.stringify(categories), 86400);
      console.log("已缓存新的分类数据");
    } catch (error) {
      console.error("缓存新数据失败:", error);
    }

    return categories;
  }

  /**
   * 创建文章分类
   */
  async createCategory(name: string, description?: string) {
    const category = this.categoryRepository.create({
      name,
      description,
    });

    const savedCategory = await this.categoryRepository.save(category);

    // 清除缓存
    await this.redisService.del("articles:categories");
    await this.redisService.del("articles:list:*");

    return savedCategory;
  }

  /**
   * 更新文章分类
   */
  async updateCategory(id: number, name?: string, description?: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException("分类不存在");
    }

    if (name) {
      category.name = name;
    }

    if (description !== undefined) {
      category.description = description;
    }

    const updatedCategory = await this.categoryRepository.save(category);

    // 清除缓存
    await this.redisService.del("articles:categories");
    await this.redisService.del("articles:list:*");

    return updatedCategory;
  }

  /**
   * 删除文章分类
   */
  async deleteCategory(id: number) {
    const result = await this.categoryRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException("分类不存在");
    }

    // 清除缓存
    await this.redisService.del("articles:categories");
    await this.redisService.del("articles:list:*");

    return { message: "删除成功" };
  }

  /**
   * 获取所有内容类型的活动数据，按日期分组
   */
  async getActivityData(year?: number, userId?: number) {
    const targetYear = year || new Date().getFullYear();
    // 添加用户ID到缓存键，确保每个用户有独立缓存
    const cacheKey = `content:activity:${userId || "public"}:${targetYear}`;

    // 尝试从缓存获取，如果失败则直接从数据库查询
    try {
      const cached = await this.redisService.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Redis缓存获取失败:", error);
    }

    // 按日期分组统计
    const activityMap = new Map<string, number>();

    // 查询文章，根据用户ID过滤
    const articleQuery: any = {
      select: ["createdAt"],
      order: { createdAt: "DESC" },
    };
    if (userId) {
      articleQuery.where = { author: { id: userId } };
    }
    const articles = await this.articleRepository.find(articleQuery);
    articles.forEach((article) => {
      const date = article.createdAt.toISOString().split("T")[0];
      activityMap.set(date, (activityMap.get(date) || 0) + 1);
    });

    // 查询音乐，根据用户ID过滤
    const musicQuery: any = {};
    if (userId) {
      musicQuery.userId = userId;
    }
    const music = await this.musicService.findAll(musicQuery);
    music.forEach((item) => {
      const date = item.createdAt.toISOString().split("T")[0];
      activityMap.set(date, (activityMap.get(date) || 0) + 1);
    });

    // 查询图片，根据用户ID过滤
    const imageQuery: any = {};
    if (userId) {
      imageQuery.userId = userId;
    }
    const images = await this.imageService.findAll(imageQuery);
    images.forEach((item) => {
      const date = item.createdAt.toISOString().split("T")[0];
      activityMap.set(date, (activityMap.get(date) || 0) + 1);
    });

    // 查询视频，根据用户ID过滤
    const videoQuery: any = {};
    if (userId) {
      videoQuery.userId = userId;
    }
    const videos = await this.videoService.findAll(videoQuery);
    videos.forEach((item) => {
      const date = item.createdAt.toISOString().split("T")[0];
      activityMap.set(date, (activityMap.get(date) || 0) + 1);
    });

    // 生成指定年份的所有日期数据
    const activityData = [];

    // 生成指定年份的所有日期（1月1日到12月31日）
    for (let month = 0; month < 12; month++) {
      // 计算当月天数
      const daysInMonth = new Date(targetYear, month + 1, 0).getDate();

      // 生成当月每一天
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(targetYear, month, day);
        const formattedDate = date.toISOString().split("T")[0];
        const count = activityMap.get(formattedDate) || 0;

        activityData.push({
          date: formattedDate,
          count,
          description: count > 0 ? `${count} 条内容` : "无内容",
        });
      }
    }

    // 构建统一响应格式
    const response = {
      code: 200,
      message: "获取活动数据成功",
      data: activityData,
    };

    // 尝试缓存结果，如果失败则忽略
    try {
      // 缓存12小时
      await this.redisService.set(cacheKey, JSON.stringify(response), 43200);
    } catch (error) {
      console.error("Redis缓存设置失败:", error);
    }

    // 返回统一的响应格式
    return response;
  }

  /**
   * 切换点赞状态
   */
  async toggleLike(
    userId: number,
    articleId: number
  ): Promise<{ isLiked: boolean; likes: number }> {
    // 查找文章
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });
    if (!article) {
      throw new NotFoundException("文章不存在");
    }

    // 查找点赞记录
    const like = await this.articleLikeRepository.findOne({
      where: { userId, articleId },
    });

    let isLiked: boolean;

    if (like) {
      // 已点赞，取消点赞
      await this.articleLikeRepository.remove(like);
      article.likes = Math.max(0, article.likes - 1);
      isLiked = false;
    } else {
      // 未点赞，添加点赞
      await this.articleLikeRepository.save({
        userId,
        articleId,
      });
      article.likes += 1;
      isLiked = true;
    }

    // 保存文章点赞数
    await this.articleRepository.save(article);

    // 清除缓存
    await this.redisService.del(`articles:list:*`);

    return { isLiked, likes: article.likes };
  }

  /**
   * 检查用户是否已点赞
   */
  async checkLikeStatus(userId: number, articleId: number): Promise<boolean> {
    const like = await this.articleLikeRepository.findOne({
      where: { userId, articleId },
    });
    return !!like;
  }

  /**
   * 切换收藏状态
   */
  async toggleCollect(
    userId: number,
    articleId: number
  ): Promise<{ isCollected: boolean; collects: number }> {
    // 查找文章，确保文章存在
    const article = await this.articleRepository.findOneOrFail({
      where: { id: articleId },
    });

    // 查找收藏记录
    const collect = await this.articleCollectRepository.findOne({
      where: { userId, articleId },
    });

    let isCollected: boolean;

    if (collect) {
      // 已收藏，取消收藏
      await this.articleCollectRepository.remove(collect);
      isCollected = false;
    } else {
      // 未收藏，添加收藏
      await this.articleCollectRepository.save({
        userId,
        articleId,
      });
      isCollected = true;
    }

    // 直接从数据库计算收藏数，确保准确性
    const collects = await this.articleCollectRepository.count({
      where: { articleId },
    });

    // 更新文章表中的collects字段（用于其他查询优化）
    await this.articleRepository.update(articleId, { collects });

    // 清除缓存
    await this.redisService.del(`articles:list:*`);

    return { isCollected, collects };
  }

  /**
   * 检查用户是否已收藏
   */
  async checkCollectStatus(
    userId: number,
    articleId: number
  ): Promise<boolean> {
    const collect = await this.articleCollectRepository.findOne({
      where: { userId, articleId },
    });
    return !!collect;
  }

  /**
   * 获取用户点赞的文章列表
   */
  async getUserLikedArticles(userId: number) {
    console.log("获取用户点赞文章 - userId:", userId);

    // 查找用户点赞的文章ID列表
    const likes = await this.articleLikeRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });

    console.log("获取到的点赞记录:", likes.length, likes);

    // 获取文章ID列表
    const articleIds = likes.map((like) => like.articleId);

    console.log("提取的文章ID列表:", articleIds);

    // 如果没有点赞记录，返回空列表
    if (articleIds.length === 0) {
      console.log("没有点赞记录，返回空列表");
      return [];
    }

    // 查询文章详情
    const articles = await this.articleRepository.find({
      where: { id: In(articleIds) },
      relations: ["category", "tags", "author"],
      order: { createdAt: "DESC" },
    });

    console.log("查询到的文章数量:", articles.length);
    return articles;
  }

  /**
   * 获取用户收藏的文章列表
   */
  async getUserCollectedArticles(userId: number) {
    console.log("获取用户收藏文章 - userId:", userId);

    // 查找用户收藏的文章ID列表
    const collects = await this.articleCollectRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });

    console.log("获取到的收藏记录:", collects.length, collects);

    // 获取文章ID列表
    const articleIds = collects.map((collect) => collect.articleId);

    console.log("提取的文章ID列表:", articleIds);

    // 如果没有收藏记录，返回空列表
    if (articleIds.length === 0) {
      console.log("没有收藏记录，返回空列表");
      return [];
    }

    // 查询文章详情
    const articles = await this.articleRepository.find({
      where: { id: In(articleIds) },
      relations: ["category", "tags"],
      order: { createdAt: "DESC" },
    });

    console.log("查询到的文章数量:", articles.length);
    return articles;
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Article } from "./entities/article.entity";
import { Category } from "./entities/category.entity";
import { Tag } from "./entities/tag.entity";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { RedisService } from "@/common/redis/redis.service";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private redisService: RedisService
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
    await this.redisService.del("articles:activity");

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
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ["category", "tags"],
    });

    if (!article) {
      throw new NotFoundException("文章不存在");
    }

    // 增加访问量
    article.views += 1;
    await this.articleRepository.save(article);

    return article;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto
  ): Promise<Article> {
    const article = await this.findOne(id);

    Object.assign(article, updateArticleDto);

    if (updateArticleDto.categoryId) {
      article.category = await this.categoryRepository.findOne({
        where: { id: updateArticleDto.categoryId },
      });
    }

    if (updateArticleDto.tagIds) {
      article.tags = await this.tagRepository.find({
        where: updateArticleDto.tagIds.map((id) => ({ id })),
      });
    }

    const updatedArticle = await this.articleRepository.save(article);

    // 清除缓存
    await this.redisService.del("articles:list:*");
    await this.redisService.del(`article:${id}`);
    await this.redisService.del("articles:activity");

    return updatedArticle;
  }

  async remove(id: number): Promise<void> {
    const article = await this.findOne(id);
    await this.articleRepository.remove(article);

    // 清除缓存
    await this.redisService.del("articles:list:*");
    await this.redisService.del(`article:${id}`);
    await this.redisService.del("articles:activity");
  }

  /**
   * 获取所有文章分类
   */
  async getCategories() {
    const cacheKey = "articles:categories";

    // 尝试从缓存获取，如果失败则直接从数据库查询
    try {
      const cached = await this.redisService.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Redis缓存获取失败:", error);
    }

    const categories = await this.categoryRepository.find({
      order: { id: "DESC" },
    });

    // 尝试缓存结果，如果失败则忽略
    try {
      // 缓存24小时
      await this.redisService.set(cacheKey, JSON.stringify(categories), 86400);
    } catch (error) {
      console.error("Redis缓存设置失败:", error);
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
   * 获取文章活动数据，按日期分组
   */
  async getActivityData() {
    const cacheKey = "articles:activity";

    // 尝试从缓存获取，如果失败则直接从数据库查询
    try {
      const cached = await this.redisService.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Redis缓存获取失败:", error);
    }

    // 查询所有文章，按创建日期分组
    const articles = await this.articleRepository.find({
      select: ["createdAt"],
      order: { createdAt: "DESC" },
    });

    // 按日期分组统计
    const activityMap = new Map<string, number>();

    articles.forEach((article) => {
      const date = article.createdAt.toISOString().split("T")[0];
      activityMap.set(date, (activityMap.get(date) || 0) + 1);
    });

    // 生成过去一年的所有日期数据
    const activityData = [];
    const today = new Date();

    // 生成过去一年的所有日期
    for (let i = 365; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split("T")[0];
      const count = activityMap.get(formattedDate) || 0;

      activityData.push({
        date: formattedDate,
        count,
        description: count > 0 ? `${count} 篇文章` : "无文章",
      });
    }

    // 尝试缓存结果，如果失败则忽略
    try {
      // 缓存12小时
      await this.redisService.set(
        cacheKey,
        JSON.stringify(activityData),
        43200
      );
    } catch (error) {
      console.error("Redis缓存设置失败:", error);
    }

    return activityData;
  }
}

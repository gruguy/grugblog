import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { Public } from "@/common/decorators/public.decorator";

@ApiTags("文章")
@Controller("articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "获取文章列表" })
  async findAll(
    @Query("page") page: string = "1",
    @Query("size") size: string = "10",
    @Query("categoryId") categoryId?: string,
    @Query("tagId") tagId?: string
  ) {
    return this.articleService.findAll(
      parseInt(page),
      parseInt(size),
      categoryId ? parseInt(categoryId) : undefined,
      tagId ? parseInt(tagId) : undefined
    );
  }

  @Public()
  @Get("activity")
  @ApiOperation({ summary: "获取文章活动数据" })
  async getActivityData() {
    return await this.articleService.getActivityData();
  }

  @Public()
  @Get("categories")
  @ApiOperation({ summary: "获取文章分类列表" })
  async getCategories() {
    return await this.articleService.getCategories();
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "获取文章详情" })
  async findOne(@Param("id") id: string) {
    return this.articleService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("categories")
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建文章分类" })
  async createCategory(@Body() body: { name: string; description?: string }) {
    return await this.articleService.createCategory(
      body.name,
      body.description
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch("categories/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "更新文章分类" })
  async updateCategory(
    @Param("id") id: string,
    @Body() body: { name?: string; description?: string }
  ) {
    return await this.articleService.updateCategory(
      +id,
      body.name,
      body.description
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete("categories/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除文章分类" })
  async deleteCategory(@Param("id") id: string) {
    return await this.articleService.deleteCategory(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建文章" })
  async create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "更新文章" })
  async update(
    @Param("id") id: string,
    @Body() updateArticleDto: UpdateArticleDto
  ) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除文章" })
  async remove(@Param("id") id: string) {
    await this.articleService.remove(+id);
    return { message: "删除成功" };
  }

  @Public()
  @Post(":id/like")
  @ApiOperation({ summary: "切换点赞状态" })
  async toggleLike(@Param("id") id: string, @Request() req) {
    // 允许匿名点赞，使用默认userId=0
    const userId = req.user?.id || 0;
    return await this.articleService.toggleLike(userId, +id);
  }

  @Public()
  @Get(":id/like/status")
  @ApiOperation({ summary: "检查点赞状态" })
  async checkLikeStatus(@Param("id") id: string, @Request() req) {
    // 允许匿名检查点赞状态，使用默认userId=0
    const userId = req.user?.id || 0;
    const isLiked = await this.articleService.checkLikeStatus(userId, +id);
    return { isLiked };
  }

  @Public()
  @Post(":id/collect")
  @ApiOperation({ summary: "切换收藏状态" })
  async toggleCollect(@Param("id") id: string, @Request() req) {
    // 允许匿名收藏，使用默认userId=0
    const userId = req.user?.id || 0;
    return await this.articleService.toggleCollect(userId, +id);
  }

  @Public()
  @Get(":id/collect/status")
  @ApiOperation({ summary: "检查收藏状态" })
  async checkCollectStatus(@Param("id") id: string, @Request() req) {
    // 允许匿名检查收藏状态，使用默认userId=0
    const userId = req.user?.id || 0;
    const isCollected = await this.articleService.checkCollectStatus(
      userId,
      +id
    );
    return { isCollected };
  }
}

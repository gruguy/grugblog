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

console.log("ArticleController - 正在加载...");

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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("activity")
  @ApiOperation({ summary: "获取用户活动数据" })
  async getActivityData(@Request() req, @Query("year") year?: string) {
    const yearNumber = year ? parseInt(year) : undefined;
    const userId = req.user?.id;
    return await this.articleService.getActivityData(yearNumber, userId);
  }

  @Public()
  @Get("categories")
  @ApiOperation({ summary: "获取文章分类列表" })
  async getCategories() {
    console.log("categories endpoint called");
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
  async create(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    // 添加当前登录用户ID作为文章作者ID
    const articleWithAuthor = {
      ...createArticleDto,
      authorId: req.user.id,
    };
    return this.articleService.create(articleWithAuthor);
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

  // 保留这个端点以保持API兼容性
  @UseGuards(JwtAuthGuard)
  @Patch(":id/status")
  @ApiBearerAuth()
  @ApiOperation({ summary: "更新文章状态" })
  async updateStatus(
    @Param("id") id: string,
    @Body() body: { status: string }
  ) {
    const updateDto = { status: body.status } as UpdateArticleDto;
    return this.articleService.update(+id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/like")
  @ApiBearerAuth()
  @ApiOperation({ summary: "切换点赞状态" })
  async toggleLike(@Param("id") id: string, @Request() req) {
    const userId = req.user.id;
    return await this.articleService.toggleLike(userId, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id/like/status")
  @ApiBearerAuth()
  @ApiOperation({ summary: "检查点赞状态" })
  async checkLikeStatus(@Param("id") id: string, @Request() req) {
    const userId = req.user.id;
    const isLiked = await this.articleService.checkLikeStatus(userId, +id);
    return { isLiked };
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/collect")
  @ApiBearerAuth()
  @ApiOperation({ summary: "切换收藏状态" })
  async toggleCollect(@Param("id") id: string, @Request() req) {
    const userId = req.user.id;
    return await this.articleService.toggleCollect(userId, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id/collect/status")
  @ApiBearerAuth()
  @ApiOperation({ summary: "检查收藏状态" })
  async checkCollectStatus(@Param("id") id: string, @Request() req) {
    const userId = req.user.id;
    const isCollected = await this.articleService.checkCollectStatus(
      userId,
      +id
    );
    return { isCollected };
  }

  @UseGuards(JwtAuthGuard)
  @Get("user/liked")
  @ApiBearerAuth()
  @ApiOperation({ summary: "获取用户点赞的文章列表" })
  async getUserLikedArticles(@Request() req) {
    const userId = req.user.id;
    return await this.articleService.getUserLikedArticles(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("user/collected")
  @ApiBearerAuth()
  @ApiOperation({ summary: "获取用户收藏的文章列表" })
  async getUserCollectedArticles(@Request() req) {
    const userId = req.user.id;
    return await this.articleService.getUserCollectedArticles(userId);
  }
}

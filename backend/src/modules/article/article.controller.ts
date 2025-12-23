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

  @Public()
  @Get(":id(\d+)")
  @ApiOperation({ summary: "获取文章详情" })
  async findOne(@Param("id") id: string) {
    return this.articleService.findOne(+id);
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
}

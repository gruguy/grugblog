import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CommentService } from "./comment.service";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { Public } from "@/common/decorators/public.decorator";

@ApiTags("评论")
@Controller("comments")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: "创建评论" })
  async create(
    @Body("content") content: string,
    @Body("author") author: string,
    @Body("articleId") articleId: number,
    @Request() req,
    @Body("parentId") parentId?: number | null
  ) {
    // 允许匿名评论，使用默认userId=0
    const userId = req.user?.id || 0;
    return this.commentService.create(
      content,
      author,
      articleId,
      userId,
      parentId
    );
  }

  @Public()
  @Get("article/:articleId")
  @ApiOperation({ summary: "获取文章评论列表" })
  async findByArticleId(@Param("articleId") articleId: string) {
    return this.commentService.findByArticleId(parseInt(articleId));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除评论" })
  async remove(@Param("id") id: string, @Request() req) {
    const userId = req.user.id;
    return this.commentService.remove(parseInt(id), userId);
  }
}

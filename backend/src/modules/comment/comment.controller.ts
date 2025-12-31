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
    @Request() req,
    @Body("content") content: string,
    @Body("author") author: string,
    @Body("articleId") articleId: number,
    @Body("parentId") parentId?: number | null,
    @Body("avatar") avatar?: string
  ) {
    // 添加调试日志，查看接收到的所有参数
    console.log("接收到的评论参数:", {
      content,
      author,
      articleId,
      parentId,
      avatar,
      userId: req.user?.id,
    });

    // 允许匿名评论，使用默认userId=0
    const userId = req.user?.id || 0;
    return this.commentService.create(
      content,
      author,
      articleId,
      userId,
      parentId,
      avatar
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

  @Public()
  @Post(":id/like")
  @ApiOperation({ summary: "切换评论点赞状态" })
  async toggleLike(@Param("id") id: string, @Request() req) {
    // 允许匿名点赞，使用默认userId=0
    const userId = req.user?.id || 0;
    return this.commentService.toggleLike(parseInt(id), userId);
  }
}

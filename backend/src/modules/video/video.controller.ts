import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { VideoService } from "./video.service";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";

@ApiTags("视频")
@Controller("videos")
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: "获取视频列表" })
  async findAll(@Request() req) {
    const userId = req.user?.id;
    return this.videoService.findAll({ userId });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建视频" })
  async create(@Body() videoData: any, @Request() req) {
    videoData.userId = req.user.id;
    return this.videoService.create(videoData);
  }
}

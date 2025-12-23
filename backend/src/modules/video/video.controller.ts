import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { VideoService } from './video.service'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { Public } from '@/common/decorators/public.decorator'

@ApiTags('视频')
@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '获取视频列表' })
  async findAll() {
    return this.videoService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建视频' })
  async create(@Body() videoData: any) {
    return this.videoService.create(videoData)
  }
}


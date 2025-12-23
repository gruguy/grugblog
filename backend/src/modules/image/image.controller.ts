import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ImageService } from './image.service'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { Public } from '@/common/decorators/public.decorator'

@ApiTags('图片')
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '获取图片列表' })
  async findAll(@Query('categoryId') categoryId?: string) {
    return this.imageService.findAll(
      categoryId ? parseInt(categoryId) : undefined,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建图片' })
  async create(@Body() imageData: any) {
    return this.imageService.create(imageData)
  }
}


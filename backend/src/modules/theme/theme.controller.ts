import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ThemeService } from './theme.service'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { Public } from '@/common/decorators/public.decorator'

@ApiTags('主题')
@Controller('theme')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '获取主题列表' })
  async findAll() {
    return this.themeService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建主题' })
  async create(@Body() themeData: any) {
    return this.themeService.create(themeData)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新主题' })
  async update(@Param('id') id: string, @Body() themeData: any) {
    return this.themeService.update(+id, themeData)
  }
}


import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { SystemService } from './system.service'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { Public } from '@/common/decorators/public.decorator'

@ApiTags('系统')
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Public()
  @Get('config')
  @ApiOperation({ summary: '获取系统配置' })
  async getConfig() {
    return this.systemService.getAllConfigs()
  }

  @UseGuards(JwtAuthGuard)
  @Post('config')
  @ApiBearerAuth()
  @ApiOperation({ summary: '设置系统配置' })
  async setConfig(@Body() configData: { key: string; value: string }) {
    return this.systemService.setConfig(configData.key, configData.value)
  }
}


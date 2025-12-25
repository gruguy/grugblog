import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('测试')
@Controller('test')
export class TestController {
  @Get('hello')
  @ApiOperation({ summary: '测试路由' })
  async hello() {
    return { message: 'Hello, World!' }
  }
}
import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Public } from "../../common/decorators/public.decorator";

@ApiTags("测试")
@Controller("test")
export class TestController {
  @Public()
  @Get("hello")
  @ApiOperation({ summary: "测试路由" })
  async hello() {
    return { message: "Hello, World!" };
  }
}

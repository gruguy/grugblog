import { Controller, Get, Post, Param } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  getTest() {
    return { message: 'GET test works' };
  }

  @Post(':id/like')
  postTestLike(@Param('id') id: string) {
    return { message: `POST test like ${id} works` };
  }
}
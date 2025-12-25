import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Post('register')
  register(@Body() body: any): any {
    return { message: 'Register works', body };
  }
}
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AppController {
  @Get('test')
  getHello(): string {
    return 'Hello World!';
  }

  @Post('register')
  register(@Body() body: any): any {
    return { message: 'Register works', body };
  }
}
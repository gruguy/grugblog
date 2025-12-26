import { Controller, Get, Post, Body } from "@nestjs/common";
import { Public } from "./common/decorators/public.decorator";

@Controller()
export class AppController {
  @Public()
  @Get()
  getHello(): string {
    return "Hello World!";
  }

  @Public()
  @Get("health")
  getHealth(): any {
    return { status: "ok" };
  }

  @Post("register")
  register(@Body() body: any): any {
    return { message: "Register works", body };
  }
}

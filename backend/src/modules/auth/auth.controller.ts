import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { UserService } from "../user/user.service";
import { Public } from "@/common/decorators/public.decorator";

@ApiTags("认证")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Public()
  @Post("register")
  @ApiOperation({ summary: "用户注册" })
  async register(
    @Body() body: { username: string; password: string; email: string }
  ) {
    const user = await this.userService.create({
      username: body.username,
      password: body.password,
      email: body.email,
    });
    return this.authService.login(user);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiOperation({ summary: "用户登录" })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("user")
  @ApiOperation({ summary: "获取当前用户信息" })
  async getUserInfo(@Request() req) {
    return {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
    };
  }
}

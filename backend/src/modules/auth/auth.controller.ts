import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Put,
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
    @Body() body: { username: string; password: string; email: string; captchaToken?: string }
  ) {
    if (!body.captchaToken) {
      throw new Error('请完成人机验证');
    }
    
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
    const user = await this.userService.findById(req.user.id);
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 返回完整的用户信息，包括nickname和bio
    const { password, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put("user")
  @ApiOperation({ summary: "更新当前用户信息" })
  async updateUserInfo(@Request() req, @Body() userData: { nickname?: string; bio?: string; avatar?: string }) {
    const updatedUser = await this.userService.update(req.user.id, userData);
    const { password, ...result } = updatedUser;
    return result;
  }
}

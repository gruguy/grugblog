import { Controller, Get, UseGuards, Request, Post, Delete, Param } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { UserService } from './user.service'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { Public } from '@/common/decorators/public.decorator'

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.userService.findById(req.user.id)
    if (!user) {
      throw new Error('用户不存在')
    }
    const { password, ...result } = user
    return result
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('follow/:id')
  async followUser(@Request() req, @Param('id') followingId: string) {
    const userId = req.user.id
    const follow = await this.userService.followUser(userId, parseInt(followingId))
    return follow
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('follow/:id')
  async unfollowUser(@Request() req, @Param('id') followingId: string) {
    const userId = req.user.id
    await this.userService.unfollowUser(userId, parseInt(followingId))
    return { message: '取消关注成功' }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('follow/:id/status')
  async checkFollowStatus(@Request() req, @Param('id') followingId: string) {
    const userId = req.user.id
    const isFollowing = await this.userService.isFollowing(userId, parseInt(followingId))
    return { isFollowing }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('following')
  async getFollowingList(@Request() req) {
    const userId = req.user.id
    return this.userService.getFollowingList(userId)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('followers')
  async getFollowersList(@Request() req) {
    const userId = req.user.id
    return this.userService.getFollowersList(userId)
  }

  @Public()
  @Get('ranking')
  async getAuthorRanking() {
    return this.userService.getAuthorRanking(5)
  }
}


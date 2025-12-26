import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { RedisService } from '@/common/redis/redis.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username)
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    const isPasswordValid = await this.userService.validatePassword(
      password,
      user.password,
    )
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    const { password: _, ...result } = user
    return result
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id }
    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })

    // 存储refresh token到Redis
    await this.redisService.set(
      `refresh_token:${user.id}`,
      refreshToken,
      7 * 24 * 60 * 60, // 7天
    )

    return {
      code: 200,
      message: '登录成功',
      data: {
        token: accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      },
    }
  }

  async logout(userId: number) {
    await this.redisService.del(`refresh_token:${userId}`)
    return { message: '登出成功' }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken)
      const storedToken = await this.redisService.get(
        `refresh_token:${payload.sub}`,
      )

      if (storedToken !== refreshToken) {
        throw new UnauthorizedException('无效的刷新令牌')
      }

      const newPayload = { username: payload.username, sub: payload.sub }
      const accessToken = this.jwtService.sign(newPayload)

      return { token: accessToken }
    } catch (error) {
      throw new UnauthorizedException('无效的刷新令牌')
    }
  }
}


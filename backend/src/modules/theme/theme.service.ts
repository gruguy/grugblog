import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Theme } from './entities/theme.entity'
import { Cron, CronExpression } from '@nestjs/schedule'
import * as dayjs from 'dayjs'

@Injectable()
export class ThemeService {
  constructor(
    @InjectRepository(Theme)
    private themeRepository: Repository<Theme>,
  ) {}

  async findAll(): Promise<Theme[]> {
    return this.themeRepository.find({
      order: { createdAt: 'DESC' },
    })
  }

  async create(themeData: Partial<Theme>): Promise<Theme> {
    const theme = this.themeRepository.create(themeData)
    return this.themeRepository.save(theme)
  }

  async update(id: number, themeData: Partial<Theme>): Promise<Theme> {
    await this.themeRepository.update(id, themeData)
    return this.themeRepository.findOne({ where: { id } })
  }

  // 定时任务：每分钟检查是否需要切换主题
  @Cron(CronExpression.EVERY_MINUTE)
  async checkThemeSwitch() {
    const themes = await this.themeRepository.find({
      where: { isEnabled: true },
    })

    const now = dayjs()
    
    for (const theme of themes) {
      if (theme.switchTime) {
        const switchTime = dayjs(theme.switchTime, 'HH:mm')
        const diff = Math.abs(now.diff(switchTime, 'minute'))
        
        // 如果时间差在1分钟内，执行切换
        if (diff < 1) {
          // TODO: 实现主题切换逻辑
          console.log(`切换到主题: ${theme.name}`)
        }
      }
    }
  }
}


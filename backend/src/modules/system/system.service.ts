import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SystemConfig } from './entities/system-config.entity'

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(SystemConfig)
    private configRepository: Repository<SystemConfig>,
  ) {}

  async getConfig(key: string): Promise<string | null> {
    const config = await this.configRepository.findOne({ where: { key } })
    return config?.value || null
  }

  async setConfig(key: string, value: string): Promise<SystemConfig> {
    let config = await this.configRepository.findOne({ where: { key } })
    
    if (config) {
      config.value = value
      return this.configRepository.save(config)
    } else {
      config = this.configRepository.create({ key, value })
      return this.configRepository.save(config)
    }
  }

  async getAllConfigs(): Promise<Record<string, string>> {
    const configs = await this.configRepository.find()
    const result: Record<string, string> = {}
    
    configs.forEach((config) => {
      result[config.key] = config.value
    })
    
    return result
  }
}


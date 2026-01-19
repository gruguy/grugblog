import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Video } from './entities/video.entity'
import { RedisService } from '@/common/redis/redis.service'

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    private redisService: RedisService,
  ) {}

  async findAll(query?: { userId?: number }): Promise<Video[]> {
    const queryBuilder = this.videoRepository.createQueryBuilder('video')
    if (query?.userId) {
      queryBuilder.where('video.userId = :userId', { userId: query.userId })
    }
    return queryBuilder.orderBy('video.createdAt', 'DESC').getMany()
  }

  async create(videoData: Partial<Video>): Promise<Video> {
    const video = this.videoRepository.create(videoData)
    const savedVideo = await this.videoRepository.save(video)
    // 清除活动缓存
    await this.redisService.del('content:activity:*')
    return savedVideo
  }
}


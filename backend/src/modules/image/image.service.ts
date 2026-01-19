import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Image } from './entities/image.entity'
import { RedisService } from '@/common/redis/redis.service'

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private redisService: RedisService,
  ) {}

  async findAll(query?: { userId?: number; categoryId?: number }): Promise<Image[]> {
    const queryBuilder = this.imageRepository.createQueryBuilder('image')
    if (query?.categoryId) {
      queryBuilder.where('image.categoryId = :categoryId', { categoryId: query.categoryId })
    }
    if (query?.userId) {
      if (queryBuilder.expressionMap.wheres.length > 0) {
        queryBuilder.andWhere('image.userId = :userId', { userId: query.userId })
      } else {
        queryBuilder.where('image.userId = :userId', { userId: query.userId })
      }
    }
    return queryBuilder.orderBy('image.createdAt', 'DESC').getMany()
  }

  async create(imageData: Partial<Image>): Promise<Image> {
    const image = this.imageRepository.create(imageData)
    const savedImage = await this.imageRepository.save(image)
    // 清除活动缓存
    await this.redisService.del('content:activity:*')
    return savedImage
  }
}


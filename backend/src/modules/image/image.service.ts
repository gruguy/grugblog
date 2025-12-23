import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Image } from './entities/image.entity'

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async findAll(categoryId?: number): Promise<Image[]> {
    const queryBuilder = this.imageRepository.createQueryBuilder('image')

    if (categoryId) {
      queryBuilder.where('image.categoryId = :categoryId', { categoryId })
    }

    return queryBuilder.orderBy('image.createdAt', 'DESC').getMany()
  }

  async create(imageData: Partial<Image>): Promise<Image> {
    const image = this.imageRepository.create(imageData)
    return this.imageRepository.save(image)
  }
}


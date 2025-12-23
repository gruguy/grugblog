import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Video } from './entities/video.entity'

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {}

  async findAll(): Promise<Video[]> {
    return this.videoRepository.find({
      order: { createdAt: 'DESC' },
    })
  }

  async create(videoData: Partial<Video>): Promise<Video> {
    const video = this.videoRepository.create(videoData)
    return this.videoRepository.save(video)
  }
}


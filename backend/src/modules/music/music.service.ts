import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Music } from './entities/music.entity'

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music)
    private musicRepository: Repository<Music>,
  ) {}

  async findAll(): Promise<Music[]> {
    return this.musicRepository.find({
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: number): Promise<Music | null> {
    return this.musicRepository.findOneBy({ id })
  }

  async create(musicData: Partial<Music>): Promise<Music> {
    const music = this.musicRepository.create(musicData)
    return this.musicRepository.save(music)
  }

  async update(id: number, musicData: Partial<Music>): Promise<Music | null> {
    const music = await this.findOne(id)
    if (!music) {
      return null
    }
    Object.assign(music, musicData)
    return this.musicRepository.save(music)
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.musicRepository.delete(id)
    return result.affected > 0
  }
}


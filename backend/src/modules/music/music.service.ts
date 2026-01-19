import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Music } from "./entities/music.entity";
import { RedisService } from "@/common/redis/redis.service";

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music)
    private musicRepository: Repository<Music>,
    private redisService: RedisService
  ) {}

  async findAll(query?: { userId?: number }): Promise<Music[]> {
    const queryBuilder = this.musicRepository.createQueryBuilder("music");
    if (query?.userId) {
      queryBuilder.where("music.userId = :userId", { userId: query.userId });
    }
    return queryBuilder.orderBy("music.createdAt", "DESC").getMany();
  }

  async findOne(id: number): Promise<Music | null> {
    return this.musicRepository.findOneBy({ id });
  }

  async create(musicData: Partial<Music>): Promise<Music> {
    const music = this.musicRepository.create(musicData);
    const savedMusic = await this.musicRepository.save(music);
    // 清除活动缓存
    await this.redisService.del("content:activity:*");
    return savedMusic;
  }

  async update(id: number, musicData: Partial<Music>): Promise<Music | null> {
    const music = await this.findOne(id);
    if (!music) {
      return null;
    }

    Object.assign(music, musicData);
    const updatedMusic = await this.musicRepository.save(music);
    // 清除活动缓存
    await this.redisService.del("content:activity:*");
    return updatedMusic;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.musicRepository.delete(id);
    if (result.affected > 0) {
      // 清除活动缓存
      await this.redisService.del("content:activity:*");
      return true;
    }
    return false;
  }
}

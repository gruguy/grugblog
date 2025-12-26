import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // 使用异步方式初始化Redis连接，避免阻塞模块初始化
    console.log("开始初始化Redis连接...");
    const host = this.configService.get("REDIS_HOST", "localhost");
    const port = this.configService.get<number>("REDIS_PORT", 6379);

    try {
      this.client = new Redis({
        host,
        port,
        password: this.configService.get("REDIS_PASSWORD"),
        db: this.configService.get<number>("REDIS_DB", 0),
        // 禁用自动连接，手动控制连接
        lazyConnect: true,
        retryStrategy: (times) => {
          // 重试策略：如果连接失败，记录错误但不阻止应用启动
          console.error(
            `Redis连接失败，第${times}次重试:`,
            `host: ${host}, port: ${port}`
          );
          // 如果重试次数超过10次，停止重试
          if (times > 10) {
            console.error(
              "Redis连接重试次数超过限制，应用将继续运行但不使用Redis缓存"
            );
            return null;
          }
          // 每次重试间隔增加1秒
          return times * 1000;
        },
      });

      // 监听连接错误
      this.client.on("error", (error) => {
        console.error("Redis连接错误:", error);
      });

      // 监听连接成功
      this.client.on("connect", () => {
        console.log("Redis连接成功");
      });

      // 手动连接，不阻塞模块初始化
      this.client.connect().catch((error) => {
        console.error("Redis手动连接失败:", error);
      });

      console.log("Redis客户端初始化完成，采用延迟连接模式");
    } catch (error) {
      console.error("Redis客户端创建失败:", error);
      // 即使创建失败，也不抛出错误，允许应用继续运行
    }
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  getClient(): Redis {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setex(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    if (key.includes("*") || key.includes("?") || key.includes("[")) {
      // 包含通配符，先获取匹配的键
      const keys = await this.client.keys(key);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } else {
      // 不包含通配符，直接删除
      await this.client.del(key);
    }
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }
}

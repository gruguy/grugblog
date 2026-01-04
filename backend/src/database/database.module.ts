import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        console.log("正在初始化数据库连接...");
        const config = {
          type: "mysql" as const,
          host: configService.get("MYSQL_HOST", "localhost"),
          port: configService.get<number>("MYSQL_PORT", 3306),
          username: configService.get("MYSQL_USER", "root"),
          password: configService.get("MYSQL_PASSWORD", "Gruguy31"),
          database: configService.get("MYSQL_DB", "blog"),
          entities: [__dirname + "/../**/*.entity{.ts,.js}"],
          synchronize: false, // 关闭自动同步，避免system_config表的唯一索引错误
          logging: true, // 启用详细SQL日志，用于调试avatar字段保存问题
          timezone: "+08:00",
          // 增加连接超时和重试设置
          connectTimeout: 10000,
          acquireTimeout: 10000,
          retryAttempts: 3,
          retryDelay: 1000,
        };
        console.log("数据库配置:", { ...config, password: "******" });
        return config;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

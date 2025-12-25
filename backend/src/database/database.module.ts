import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("MYSQL_HOST", "localhost"),
        port: configService.get<number>("MYSQL_PORT", 3306),
        username: configService.get("MYSQL_USER", "root"),
        password: configService.get("MYSQL_PASSWORD", "Gruguy31"),
        database: configService.get("MYSQL_DB", "blog"),
        entities: [__dirname + "/../**/*.entity{.ts,.js}"],
        synchronize: false, // 禁用自动同步，手动管理表结构
        logging: configService.get("NODE_ENV") === "development",
        timezone: "+08:00",
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

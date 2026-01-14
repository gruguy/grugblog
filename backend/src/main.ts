import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { join } from "path";

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ["log", "error", "warn", "debug", "verbose"],
    });

    // 只保留CORS配置
    app.enableCors({
      origin: true,
      credentials: true,
    });

    // 配置静态文件服务，使/uploads路径可以访问上传的文件
    app.use(
      "/uploads",
      require("express").static(join(__dirname, "..", "..", "uploads"))
    );

    // 添加路由调试中间件
    app.use((req, res, next) => {
      console.log(`Received ${req.method} request to ${req.url}`);
      next();
    });

    // 设置API全局前缀（暂时注释，用于测试）
    // app.setGlobalPrefix("api");

    // 全局注册拦截器和过滤器
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    console.error("应用程序启动失败:", error);
    process.exit(1);
  }
}

bootstrap();

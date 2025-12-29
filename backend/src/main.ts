import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['log', 'error', 'warn', 'debug', 'verbose']
    })

    // 只保留CORS配置
    app.enableCors({
      origin: true,
      credentials: true,
    })

    // 设置API全局前缀
    app.setGlobalPrefix('api')

    // 全局注册拦截器和过滤器
    app.useGlobalInterceptors(new TransformInterceptor())
    app.useGlobalFilters(new HttpExceptionFilter())

    const port = process.env.PORT || 3000
    await app.listen(port)
    console.log(`Application is running on: http://localhost:${port}`)
  } catch (error) {
    console.error('应用程序启动失败:', error)
    process.exit(1)
  }
}

bootstrap()

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

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

    const port = process.env.PORT || 3000
    await app.listen(port)
    console.log(`Application is running on: http://localhost:${port}`)
  } catch (error) {
    console.error('应用程序启动失败:', error)
    process.exit(1)
  }
}

bootstrap()

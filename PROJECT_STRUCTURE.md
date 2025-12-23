# 项目结构说明

## 目录结构

```
blog/
├── frontend/              # 前台博客前端（Vue3 + TailwindCSS）
│   ├── src/
│   │   ├── api/          # API接口封装
│   │   ├── components/   # 公共组件
│   │   ├── layouts/      # 布局组件
│   │   ├── router/       # 路由配置
│   │   ├── stores/       # Pinia状态管理
│   │   ├── styles/       # 样式文件
│   │   ├── types/        # TypeScript类型定义
│   │   └── views/        # 页面组件
│   ├── Dockerfile
│   └── nginx.conf
│
├── admin/                 # 后台管理前端（ElementPlus）
│   ├── src/
│   │   ├── api/          # API接口封装
│   │   ├── layouts/      # 布局组件
│   │   ├── router/       # 路由配置
│   │   ├── stores/       # Pinia状态管理
│   │   ├── types/        # TypeScript类型定义
│   │   └── views/        # 页面组件
│   ├── Dockerfile
│   └── nginx.conf
│
├── backend/               # 后端服务（NestJS）
│   ├── src/
│   │   ├── common/       # 公共模块
│   │   │   ├── decorators/  # 装饰器
│   │   │   ├── filters/     # 异常过滤器
│   │   │   ├── guards/      # 守卫
│   │   │   ├── interceptors/# 拦截器
│   │   │   └── redis/       # Redis服务
│   │   ├── database/    # 数据库配置
│   │   ├── modules/     # 业务模块
│   │   │   ├── auth/        # 认证模块
│   │   │   ├── user/        # 用户模块
│   │   │   ├── article/     # 文章模块
│   │   │   ├── music/       # 音乐模块
│   │   │   ├── image/       # 图片模块
│   │   │   ├── video/       # 视频模块
│   │   │   ├── theme/       # 主题模块
│   │   │   ├── system/      # 系统模块
│   │   │   └── upload/       # 上传模块
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── database/         # 数据库初始化脚本
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml    # Docker编排配置
├── README.md             # 项目说明
└── .gitignore           # Git忽略文件
```

## 核心功能模块

### 前端展示层（frontend）
- **主题切换**：支持手动切换和定时切换主题
- **响应式设计**：适配移动端、平板、PC端
- **文章展示**：文章列表、详情、分类筛选
- **音乐播放**：音乐列表、在线播放
- **相册展示**：图片瀑布流、预览
- **视频播放**：Vlog列表、视频播放

### 后台管理端（admin）
- **内容管理**：文章、音乐、图片、视频的CRUD操作
- **数据统计**：访问量统计、内容分布图表
- **系统设置**：网站配置、主题管理

### 后端服务（backend）
- **认证授权**：JWT认证、Refresh Token机制
- **文件上传**：支持单文件和多文件上传
- **缓存策略**：Redis缓存热门数据
- **定时任务**：主题定时切换、数据统计
- **API文档**：Swagger自动生成接口文档

## 技术栈

### 前端
- Vue3 (Composition API)
- TypeScript
- TailwindCSS
- Pinia
- Vue Router
- Axios
- ElementPlus (后台)

### 后端
- NestJS
- TypeScript
- TypeORM
- MySQL
- Redis
- JWT
- Swagger

### 部署
- Docker
- Docker Compose
- Nginx

## 开发指南

### 环境要求
- Node.js >= 18
- Docker & Docker Compose
- MySQL >= 8.0
- Redis >= 7.0

### 启动步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd blog
```

2. **配置环境变量**
```bash
# 前端
cp frontend/.env.example frontend/.env

# 后端
cp backend/.env.example backend/.env
```

3. **使用Docker启动（推荐）**
```bash
docker-compose up -d
```

4. **本地开发**
```bash
# 前端
cd frontend && npm install && npm run dev

# 后台
cd admin && npm install && npm run dev

# 后端
cd backend && npm install && npm run start:dev
```

## API文档

启动后端服务后，访问：
- Swagger文档：http://localhost:3000/api/docs

## 数据库

数据库初始化脚本位于 `backend/database/init.sql`，包含：
- 用户表
- 文章表（含分类、标签）
- 音乐表
- 图片表
- 视频表
- 主题表
- 系统配置表

## 注意事项

1. **生产环境配置**
   - 修改 `.env` 文件中的敏感信息
   - 修改 `JWT_SECRET` 为强密钥
   - 修改数据库密码

2. **文件上传**
   - 开发环境：文件存储在 `backend/uploads`
   - 生产环境：建议使用对象存储（OSS/COS）

3. **缓存策略**
   - 文章列表缓存1小时
   - 用户信息缓存与Token一致
   - 定时清理过期缓存

4. **安全建议**
   - 启用HTTPS
   - 配置CORS白名单
   - 限制文件上传大小和类型
   - 启用接口限流


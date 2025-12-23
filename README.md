# 个人博客系统

基于 Vue3 + TailwindCSS + Pinia + TypeScript（前端）、NestJS + MySQL + Redis（后端）、ElementPlus-Admin（后台管理）、Docker（部署）构建的个人博客系统。

## 技术栈

### 前端展示层
- Vue3 (Composition API)
- TypeScript
- TailwindCSS
- Pinia
- Vue Router 4
- Axios
- VueUse
- APlayer（音乐播放）
- Vue3-Video-Play（视频播放）
- ViewerJS（图片预览）

### 后台管理端
- ElementPlus-Admin
- TypeScript
- Pinia
- ECharts（数据可视化）
- XLSX（数据导出）

### 后端服务层
- NestJS
- TypeScript
- TypeORM
- MySQL
- Redis
- JWT
- Multer（文件上传）
- Swagger（API文档）

### 部署
- Docker
- Docker Compose
- Nginx

## 项目结构

```
blog/
├── frontend/          # 前台博客前端
├── admin/             # 后台管理前端
├── backend/           # 后端服务
├── docker-compose.yml # Docker编排配置
└── data/              # 数据持久化目录
    ├── mysql/
    └── redis/
```

## 快速开始

### 开发环境

1. 安装依赖
```bash
# 前端
cd frontend && npm install

# 后台
cd admin && npm install

# 后端
cd backend && npm install
```

2. 启动服务
```bash
# 使用 Docker Compose 启动所有服务
docker-compose up -d

# 或分别启动
# 前端开发服务器
cd frontend && npm run dev

# 后台开发服务器
cd admin && npm run dev

# 后端开发服务器
cd backend && npm run start:dev
```

### 生产环境

```bash
# 构建并启动所有容器
docker-compose up -d --build
```

## 功能特性

- ✅ 响应式设计（移动端、平板、PC端适配）
- ✅ 主题定制与切换（手动 + 定时）
- ✅ 文章管理（Markdown支持）
- ✅ 音乐馆（在线播放）
- ✅ 相册（瀑布流布局）
- ✅ Vlog视频播放
- ✅ 后台管理系统
- ✅ JWT认证授权
- ✅ Redis缓存
- ✅ 文件上传与管理
- ✅ 数据统计

## 环境变量配置

### 前端环境变量
创建 `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### 后端环境变量
创建 `backend/.env`:
```
NODE_ENV=development
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=123456
MYSQL_DB=blog
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_key
```

## 许可证

MIT


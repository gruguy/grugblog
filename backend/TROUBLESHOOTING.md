# 登录接口 404 错误排查指南

## 问题现象
点击登录接口报错 404

## 排查步骤

### 1. 检查后端服务是否运行

```bash
# 检查端口是否被占用
netstat -ano | findstr :3000

# 或者使用 PowerShell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
```

### 2. 启动后端服务

```bash
cd backend
npm run start:dev
```

应该看到类似输出：
```
Application is running on: http://localhost:3000
Swagger docs: http://localhost:3000/api/docs
```

### 3. 测试接口

#### 使用浏览器访问：
- Swagger 文档：http://localhost:3000/api/docs
- 健康检查：http://localhost:3000/api/health

#### 使用 PowerShell 测试登录接口：
```powershell
$body = @{
    username = 'admin'
    password = 'admin123'
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/login' -Method POST -Body $body -ContentType 'application/json'
```

### 4. 检查数据库连接

确保数据库已正确初始化：
```bash
# 执行数据库重置脚本
mysql -u root -p < backend/database/reset.sql
```

### 5. 检查环境变量

确保 `backend/.env` 文件存在并配置正确：
```env
NODE_ENV=development
PORT=3000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=你的密码
MYSQL_DB=blog
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_key
```

### 6. 检查前端代理配置

确保 `admin/vite.config.ts` 中的代理配置正确：
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}
```

### 7. 检查前端 API 配置

确保 `admin/src/api/request.ts` 中的 baseURL 正确：
```typescript
baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
```

## 常见问题

### 问题1: 数据库连接失败
**症状**: 后端启动时提示数据库连接错误

**解决**: 
1. 检查 MySQL 服务是否运行
2. 检查数据库配置是否正确
3. 执行数据库重置脚本

### 问题2: 端口被占用
**症状**: 启动时提示端口 3000 已被占用

**解决**:
```bash
# Windows 查找占用端口的进程
netstat -ano | findstr :3000
# 杀死进程（替换 PID）
taskkill /PID <PID> /F
```

### 问题3: 路由未注册
**症状**: 所有接口都返回 404

**解决**: 检查 `backend/src/app.module.ts` 中是否导入了 `AuthModule`

### 问题4: CORS 错误
**症状**: 浏览器控制台提示 CORS 错误

**解决**: 检查 `backend/src/main.ts` 中的 CORS 配置

## 快速修复

如果以上步骤都无法解决，尝试：

1. **重启后端服务**:
```bash
cd backend
# 停止当前服务 (Ctrl+C)
npm run start:dev
```

2. **清除缓存并重新安装**:
```bash
cd backend
rm -rf node_modules dist
npm install
npm run start:dev
```

3. **检查日志**: 查看后端控制台的错误信息

## 验证修复

修复后，应该能够：
1. 访问 http://localhost:3000/api/docs 看到 Swagger 文档
2. 在 Swagger 文档中测试 `/api/auth/login` 接口
3. 前端登录功能正常工作


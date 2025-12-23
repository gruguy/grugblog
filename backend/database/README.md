# 数据库初始化说明

## 文件说明

- `init.sql` - 数据库初始化脚本，包含表结构创建和默认数据插入

## 使用方法

### 方式一：使用 MySQL 命令行

```bash
mysql -u root -p < init.sql
```

### 方式二：使用 Docker Compose

如果使用 Docker Compose 部署，脚本会自动执行（通过 `docker-entrypoint-initdb.d` 目录）。

### 方式三：手动执行

1. 登录 MySQL：
```bash
mysql -u root -p
```

2. 执行脚本：
```sql
source /path/to/init.sql
```

## 数据库结构

### 核心表

1. **user** - 用户表
2. **category** - 分类表
3. **tag** - 标签表
4. **article** - 文章表
5. **article_tag** - 文章标签关联表（多对多）
6. **music** - 音乐表
7. **image** - 图片表
8. **video** - 视频表
9. **theme** - 主题表
10. **system_config** - 系统配置表
11. **visit_log** - 访问日志表（可选）

## 默认数据

### 默认管理员账户

- **用户名**: `admin`
- **密码**: `admin123`
- **邮箱**: `admin@example.com`

⚠️ **重要**: 请在生产环境中立即修改默认密码！

### 默认分类

- 技术
- 生活
- 音乐
- 摄影
- 前端
- 后端
- 数据库
- DevOps

### 默认标签

包含常见的技术标签：Vue3、React、TypeScript、Node.js、NestJS 等

### 默认主题

- 浅色主题（默认启用）
- 深色主题
- 赛博朋克主题

## 索引说明

为了提高查询性能，已为以下字段创建索引：

- `user`: username, email, createdAt
- `article`: categoryId, createdAt, views, title
- `music`: artist, playCount, createdAt
- `image`: categoryId, createdAt
- `video`: playCount, createdAt, title
- `visit_log`: ip, path, createdAt

## 外键约束

- `article.categoryId` → `category.id` (SET NULL)
- `article_tag.articleId` → `article.id` (CASCADE)
- `article_tag.tagId` → `tag.id` (CASCADE)
- `image.categoryId` → `category.id` (SET NULL)

## 字符集

- 数据库字符集: `utf8mb4`
- 排序规则: `utf8mb4_unicode_ci`
- 支持完整的 Unicode 字符，包括 emoji

## 注意事项

1. **密码加密**: 使用 bcryptjs 进行密码加密，cost factor 为 10
2. **时间字段**: 所有表都包含 `createdAt` 字段，部分表包含 `updatedAt` 字段
3. **软删除**: 当前未实现软删除，删除操作为物理删除
4. **数据备份**: 建议定期备份数据库
5. **生产环境**: 在生产环境部署前，请：
   - 修改默认管理员密码
   - 检查所有配置项
   - 设置合适的数据库权限
   - 配置数据库备份策略

## 密码生成

如果需要生成新的密码哈希，可以使用 Node.js：

```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your_password', 10);
console.log(hash);
```

## 版本历史

- v1.0.0 (2024-12-22): 初始版本，包含所有核心表结构


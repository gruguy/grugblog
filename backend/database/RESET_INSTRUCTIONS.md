# 数据库重置说明

## 问题原因

TypeORM 的 `synchronize` 模式与现有数据库结构冲突。数据库中已存在的表使用了 `INT UNSIGNED` 类型，而 TypeORM 期望使用 `INT` 类型，导致外键约束创建失败。

## 解决方案

### 方法一：使用重置脚本（推荐）

#### Windows PowerShell:
```powershell
cd backend/database
.\reset-database.ps1
```

#### 手动执行 SQL:
```bash
mysql -u root -p < backend/database/reset.sql
```

### 方法二：手动删除并重建数据库

1. 登录 MySQL:
```bash
mysql -u root -p
```

2. 删除数据库:
```sql
DROP DATABASE IF EXISTS blog;
```

3. 执行重置脚本:
```bash
mysql -u root -p < backend/database/reset.sql
```

### 方法三：使用 MySQL Workbench 或其他工具

1. 打开 MySQL Workbench
2. 连接到数据库服务器
3. 执行 `reset.sql` 文件中的所有 SQL 语句

## 验证

重置后，重启后端服务：

```bash
cd backend
npm run start:dev
```

如果看到以下信息，说明数据库连接成功：
```
[Nest] Application is running on: http://localhost:3000
```

## 注意事项

1. **数据备份**: 重置数据库会删除所有现有数据，请先备份重要数据
2. **synchronize 设置**: 已临时禁用 `synchronize`，使用手动 SQL 脚本管理数据库结构
3. **生产环境**: 生产环境应始终禁用 `synchronize`，使用数据库迁移工具

## 默认账户

重置后的默认管理员账户：
- 用户名: `admin`
- 密码: `admin123`
- 邮箱: `admin@example.com`

⚠️ **请在生产环境中立即修改默认密码！**


# 快速修复数据库问题

## 问题
外键约束类型不匹配：`Referencing column 'tagId' and referenced column 'id' in foreign key constraint 'fk_article_tag_tag' are incompatible.`

## 解决方案

### 步骤 1: 停止后端服务
如果后端服务正在运行，请先停止（Ctrl+C）

### 步骤 2: 重置数据库

#### 选项 A: 使用 MySQL 命令行（推荐）

1. 打开命令提示符（CMD）或 PowerShell
2. 执行以下命令：

```bash
# 如果 MySQL 在 PATH 中
mysql -u root -p < E:\workspace\Git\grugblog\backend\database\reset.sql

# 或者使用完整路径（根据你的 MySQL 安装路径调整）
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < E:\workspace\Git\grugblog\backend\database\reset.sql
```

#### 选项 B: 使用 MySQL Workbench

1. 打开 MySQL Workbench
2. 连接到数据库服务器
3. 打开 `reset.sql` 文件
4. 执行所有 SQL 语句

#### 选项 C: 手动执行 SQL

1. 登录 MySQL:
```bash
mysql -u root -p
```

2. 执行以下 SQL:
```sql
DROP DATABASE IF EXISTS blog;
```

3. 退出 MySQL，然后执行:
```bash
mysql -u root -p < E:\workspace\Git\grugblog\backend\database\reset.sql
```

### 步骤 3: 验证修复

重启后端服务：
```bash
cd E:\workspace\Git\grugblog\backend
npm run start:dev
```

如果看到以下信息，说明修复成功：
```
Application is running on: http://localhost:3000
Swagger docs: http://localhost:3000/api/docs
```

## 重要说明

1. **数据会丢失**: 重置数据库会删除所有现有数据
2. **synchronize 已禁用**: 已禁用 TypeORM 的自动同步功能，现在使用手动 SQL 脚本管理数据库结构
3. **默认账户**: 
   - 用户名: `admin`
   - 密码: `admin123`

## 如果仍然失败

如果重置后仍然出现错误，请检查：

1. MySQL 服务是否正在运行
2. 数据库用户权限是否足够
3. 查看完整的错误信息

也可以尝试完全删除数据库后重新创建：
```sql
DROP DATABASE IF EXISTS blog;
CREATE DATABASE blog DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

然后再次执行 `reset.sql`


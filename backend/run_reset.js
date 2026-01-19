const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function executeResetSQL() {
  try {
    console.log("开始执行数据库重置脚本...");

    // 创建数据库连接（不指定database，因为需要先创建数据库）
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "Gruguy31",
    });

    console.log("数据库连接成功");

    // 1. 先删除并重新创建数据库
    await connection.query("DROP DATABASE IF EXISTS blog");
    await connection.query(
      "CREATE DATABASE blog DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    );
    await connection.query("USE blog");
    console.log("✅ 数据库初始化完成");

    // 2. 创建所有必要的表
    const tableSQLs = [
      // 用户表
      `CREATE TABLE \`user\` (
        \`id\` INT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
        \`username\` VARCHAR(50) NOT NULL COMMENT '用户名',
        \`password\` VARCHAR(255) NOT NULL COMMENT '密码（bcrypt加密）',
        \`email\` VARCHAR(100) NOT NULL COMMENT '邮箱',
        \`avatar\` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
        \`nickname\` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
        \`bio\` TEXT DEFAULT NULL COMMENT '个人简介',
        \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_username\` (\`username\`),
        UNIQUE KEY \`uk_email\` (\`email\`),
        KEY \`idx_createdAt\` (\`createdAt\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';`,

      // 分类表
      `CREATE TABLE \`category\` (
        \`id\` INT NOT NULL AUTO_INCREMENT COMMENT '分类ID',
        \`name\` VARCHAR(50) NOT NULL COMMENT '分类名称',
        \`description\` TEXT DEFAULT NULL COMMENT '分类描述',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_name\` (\`name\`),
        KEY \`idx_name\` (\`name\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';`,

      // 文章表
      `CREATE TABLE \`article\` (
        \`id\` INT NOT NULL AUTO_INCREMENT COMMENT '文章ID',
        \`title\` VARCHAR(200) NOT NULL COMMENT '文章标题',
        \`content\` TEXT NOT NULL COMMENT '文章内容',
        \`summary\` VARCHAR(500) DEFAULT NULL COMMENT '文章摘要',
        \`cover\` VARCHAR(255) DEFAULT NULL COMMENT '文章封面图',
        \`authorId\` INT NOT NULL COMMENT '作者ID',
        \`categoryId\` INT DEFAULT NULL COMMENT '分类ID',
        \`views\` INT NOT NULL DEFAULT 0 COMMENT '浏览量',
        \`likes\` INT NOT NULL DEFAULT 0 COMMENT '点赞数',
        \`collects\` INT NOT NULL DEFAULT 0 COMMENT '收藏数',
        \`status\` VARCHAR(20) NOT NULL DEFAULT 'published' COMMENT '文章状态',
        \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        PRIMARY KEY (\`id\`),
        KEY \`idx_authorId\` (\`authorId\`),
        KEY \`idx_categoryId\` (\`categoryId\`),
        KEY \`idx_createdAt\` (\`createdAt\`),
        KEY \`idx_status\` (\`status\`),
        CONSTRAINT \`fk_article_author\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_article_category\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';`,

      // 标签表
      `CREATE TABLE \`tag\` (
        \`id\` INT NOT NULL AUTO_INCREMENT COMMENT '标签ID',
        \`name\` VARCHAR(50) NOT NULL COMMENT '标签名称',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_name\` (\`name\`),
        KEY \`idx_name\` (\`name\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';`,

      // 文章标签关联表
      `CREATE TABLE \`article_tag\` (
        \`articleId\` INT NOT NULL COMMENT '文章ID',
        \`tagId\` INT NOT NULL COMMENT '标签ID',
        PRIMARY KEY (\`articleId\`, \`tagId\`),
        KEY \`idx_articleId\` (\`articleId\`),
        KEY \`idx_tagId\` (\`tagId\`),
        CONSTRAINT \`fk_article_tag_article\` FOREIGN KEY (\`articleId\`) REFERENCES \`article\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_article_tag_tag\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章标签关联表';`,

      // 文章点赞表
      `CREATE TABLE \`article_like\` (
        \`id\` INT NOT NULL AUTO_INCREMENT COMMENT '点赞ID',
        \`userId\` INT NOT NULL COMMENT '用户ID',
        \`articleId\` INT NOT NULL COMMENT '文章ID',
        \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_user_article\` (\`userId\`, \`articleId\`),
        KEY \`idx_userId\` (\`userId\`),
        KEY \`idx_articleId\` (\`articleId\`),
        CONSTRAINT \`fk_article_like_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_article_like_article\` FOREIGN KEY (\`articleId\`) REFERENCES \`article\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章点赞表';`,

      // 文章收藏表
      `CREATE TABLE \`article_collect\` (
        \`id\` INT NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
        \`userId\` INT NOT NULL COMMENT '用户ID',
        \`articleId\` INT NOT NULL COMMENT '文章ID',
        \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_user_article\` (\`userId\`, \`articleId\`),
        KEY \`idx_userId\` (\`userId\`),
        KEY \`idx_articleId\` (\`articleId\`),
        CONSTRAINT \`fk_article_collect_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_article_collect_article\` FOREIGN KEY (\`articleId\`) REFERENCES \`article\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章收藏表';`,

      // 评论表
      `CREATE TABLE \`comment\` (
        \`id\` INT NOT NULL AUTO_INCREMENT COMMENT '评论ID',
        \`content\` TEXT NOT NULL COMMENT '评论内容',
        \`author\` VARCHAR(50) DEFAULT NULL COMMENT '评论作者（匿名评论时使用）',
        \`articleId\` INT NOT NULL COMMENT '文章ID',
        \`userId\` INT DEFAULT NULL COMMENT '用户ID（登录用户评论时使用）',
        \`parentId\` INT DEFAULT NULL COMMENT '父评论ID（回复时使用）',
        \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        PRIMARY KEY (\`id\`),
        KEY \`idx_articleId\` (\`articleId\`),
        KEY \`idx_userId\` (\`userId\`),
        KEY \`idx_parentId\` (\`parentId\`),
        CONSTRAINT \`fk_comment_article\` FOREIGN KEY (\`articleId\`) REFERENCES \`article\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_comment_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT \`fk_comment_parent\` FOREIGN KEY (\`parentId\`) REFERENCES \`comment\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';`,

      // 主题表
      `CREATE TABLE \`theme\` (
        \`id\` INT NOT NULL AUTO_INCREMENT COMMENT '主题ID',
        \`name\` VARCHAR(50) NOT NULL COMMENT '主题名称',
        \`primaryColor\` VARCHAR(20) NOT NULL COMMENT '主色调',
        \`secondaryColor\` VARCHAR(20) NOT NULL COMMENT '次色调',
        \`switchTime\` VARCHAR(10) DEFAULT NULL COMMENT '定时切换时间（HH:mm格式）',
        \`isEnabled\` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否启用',
        \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_name\` (\`name\`),
        KEY \`idx_isEnabled\` (\`isEnabled\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='主题表';`,

      // 用户关注表
      `CREATE TABLE \`user_follow\` (
        \`id\` INT NOT NULL AUTO_INCREMENT COMMENT '关注ID',
        \`userId\` INT NOT NULL COMMENT '用户ID',
        \`followingId\` INT NOT NULL COMMENT '被关注用户ID',
        \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_user_following\` (\`userId\`, \`followingId\`),
        KEY \`idx_userId\` (\`userId\`),
        KEY \`idx_followingId\` (\`followingId\`),
        CONSTRAINT \`fk_user_follow_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_user_follow_following\` FOREIGN KEY (\`followingId\`) REFERENCES \`user\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户关注表';`,

      // 插入默认用户
      `INSERT INTO \`user\` (\`username\`, \`password\`, \`email\`, \`nickname\`, \`bio\`) VALUES
      ('admin', '$2a$10$.ZzVZsAqEo5h9WJ2pL8wrOQcsnZEwEereuAP/cT1tCp5gaJOTaymi', 'admin@example.com', '管理员', '系统管理员账户'),
      ('gruguy', '$2a$10$.ZzVZsAqEo5h9WJ2pL8wrOQcsnZEwEereuAP/cT1tCp5gaJOTaymi', 'gruguy@example.com', 'gruguy', '测试用户');`,

      // 插入默认分类
      `INSERT INTO \`category\` (\`name\`, \`description\`) VALUES
      ('技术', '技术相关文章，包括编程、开发、架构等内容'),
      ('生活', '生活相关文章，记录日常生活的点点滴滴'),
      ('音乐', '音乐相关分类，用于音乐资源管理'),
      ('摄影', '摄影相关分类，用于图片资源管理'),
      ('前端', '前端开发相关技术文章'),
      ('后端', '后端开发相关技术文章'),
      ('数据库', '数据库相关技术文章'),
      ('DevOps', '运维和部署相关文章');`,

      // 插入默认主题
      `INSERT INTO \`theme\` (\`name\`, \`primaryColor\`, \`secondaryColor\`, \`isEnabled\`) VALUES
      ('浅色', '#3b82f6', '#8b5cf6', 1),
      ('深色', '#60a5fa', '#a78bfa', 0),
      ('赛博朋克', '#00ff41', '#ff0080', 0);`,
    ];

    // 执行所有表创建
    for (let i = 0; i < tableSQLs.length; i++) {
      const sql = tableSQLs[i];
      try {
        await connection.query(sql);
        console.log(`✅ 执行表创建 ${i + 1}/${tableSQLs.length} 成功`);
      } catch (error) {
        console.warn(`❌ 执行表创建 ${i + 1} 失败:`, error.message);
      }
    }

    // 4. 验证表结构
    const tablesToCheck = [
      "user",
      "category",
      "article",
      "tag",
      "article_tag",
      "article_like",
      "article_collect",
      "comment",
      "theme",
      "user_follow",
    ];
    for (const table of tablesToCheck) {
      try {
        const [rows] = await connection.query(`SHOW TABLES LIKE '${table}'`);
        console.log(
          `📋 验证 ${table} 表:`,
          rows.length > 0 ? "✅ 存在" : "❌ 不存在"
        );
      } catch (error) {
        console.warn(`❌ 验证 ${table} 表失败:`, error.message);
      }
    }

    // 关闭连接
    await connection.end();
    console.log("✅ 数据库重置完成！");
    console.log("✅ 所有必要的表结构已创建");
  } catch (error) {
    console.error("❌ 执行失败:", error);
    process.exit(1);
  }
}

executeResetSQL();

-- ============================================  
-- 个人博客系统数据库初始化脚本
-- ============================================
-- 数据库版本: 1.1.0
-- 创建时间: 2025-12-30
-- 字符集: utf8mb4
-- 排序规则: utf8mb4_unicode_ci
-- ============================================

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS `blog` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `blog`;

-- ============================================
-- 1. 用户表
-- ============================================
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（bcrypt加密）',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `bio` TEXT DEFAULT NULL COMMENT '个人简介',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ============================================
-- 2. 分类表
-- ============================================
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `description` TEXT DEFAULT NULL COMMENT '分类描述',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- ============================================
-- 3. 标签表
-- ============================================
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `name` VARCHAR(50) NOT NULL COMMENT '标签名称',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- ============================================
-- 4. 文章表
-- ============================================
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '文章ID',
  `title` VARCHAR(200) NOT NULL COMMENT '文章标题',
  `content` TEXT NOT NULL COMMENT '文章内容（Markdown格式）',
  `summary` TEXT DEFAULT NULL COMMENT '文章摘要',
  `cover` VARCHAR(255) DEFAULT NULL COMMENT '封面图片URL',
  `views` INT NOT NULL DEFAULT 0 COMMENT '阅读量',
  `likes` INT NOT NULL DEFAULT 0 COMMENT '点赞数',
  `categoryId` INT DEFAULT NULL COMMENT '分类ID',
  `authorId` INT DEFAULT NULL COMMENT '作者ID',
  `status` VARCHAR(20) NOT NULL DEFAULT 'draft' COMMENT '文章状态：draft(草稿)、published(已发布)、archived(已归档)',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_categoryId` (`categoryId`),
  KEY `idx_authorId` (`authorId`),
  KEY `idx_createdAt` (`createdAt`),
  KEY `idx_views` (`views`),
  KEY `idx_title` (`title`(50)),
  CONSTRAINT `fk_article_category` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_article_author` FOREIGN KEY (`authorId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- ============================================
-- 5. 文章标签关联表（多对多）
-- ============================================
DROP TABLE IF EXISTS `article_tag`;
CREATE TABLE `article_tag` (
  `articleId` INT NOT NULL COMMENT '文章ID',
  `tagId` INT NOT NULL COMMENT '标签ID',
  PRIMARY KEY (`articleId`, `tagId`),
  KEY `idx_tagId` (`tagId`),
  CONSTRAINT `fk_article_tag_article` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_article_tag_tag` FOREIGN KEY (`tagId`) REFERENCES `tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章标签关联表';

-- ============================================
-- 6. 评论表
-- ============================================
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `content` TEXT NOT NULL COMMENT '评论内容',
  `author` VARCHAR(50) NOT NULL COMMENT '评论作者',
  `articleId` INT NOT NULL COMMENT '文章ID',
  `userId` INT NOT NULL COMMENT '用户ID',
  `parentId` INT DEFAULT NULL COMMENT '父评论ID',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_articleId` (`articleId`),
  KEY `idx_userId` (`userId`),
  KEY `idx_parentId` (`parentId`),
  KEY `idx_createdAt` (`createdAt`),
  CONSTRAINT `fk_comment_article` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comment_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comment_parent` FOREIGN KEY (`parentId`) REFERENCES `comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- ============================================
-- 7. 文章点赞表
-- ============================================
DROP TABLE IF EXISTS `article_like`;
CREATE TABLE `article_like` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '点赞ID',
  `userId` INT NOT NULL COMMENT '用户ID',
  `articleId` INT NOT NULL COMMENT '文章ID',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_article` (`userId`, `articleId`),
  KEY `idx_articleId` (`articleId`),
  KEY `idx_createdAt` (`createdAt`),
  CONSTRAINT `fk_like_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_like_article` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章点赞表';

-- ============================================
-- 8. 文章收藏表
-- ============================================
DROP TABLE IF EXISTS `article_collect`;
CREATE TABLE `article_collect` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `userId` INT NOT NULL COMMENT '用户ID',
  `articleId` INT NOT NULL COMMENT '文章ID',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_article` (`userId`, `articleId`),
  KEY `idx_articleId` (`articleId`),
  KEY `idx_createdAt` (`createdAt`),
  CONSTRAINT `fk_collect_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_collect_article` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章收藏表';

-- ============================================
-- 9. 用户关注表
-- ============================================
DROP TABLE IF EXISTS `user_follow`;
CREATE TABLE `user_follow` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '关注ID',
  `userId` INT NOT NULL COMMENT '关注者ID',
  `followingId` INT NOT NULL COMMENT '被关注者ID',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_following` (`userId`, `followingId`),
  KEY `idx_followingId` (`followingId`),
  KEY `idx_createdAt` (`createdAt`),
  CONSTRAINT `fk_follow_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_follow_following` FOREIGN KEY (`followingId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户关注表';

-- ============================================
-- 10. 音乐表
-- ============================================
DROP TABLE IF EXISTS `music`;
CREATE TABLE `music` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '音乐ID',
  `name` VARCHAR(100) NOT NULL COMMENT '音乐名称',
  `artist` VARCHAR(100) NOT NULL COMMENT '艺术家',
  `cover` VARCHAR(255) NOT NULL COMMENT '封面图片URL',
  `url` VARCHAR(255) NOT NULL COMMENT '音乐文件URL',
  `duration` INT DEFAULT NULL COMMENT '时长（秒）',
  `playCount` INT NOT NULL DEFAULT 0 COMMENT '播放次数',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_artist` (`artist`),
  KEY `idx_playCount` (`playCount`),
  KEY `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='音乐表';

-- ============================================
-- 11. 图片表
-- ============================================
DROP TABLE IF EXISTS `image`;
CREATE TABLE `image` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '图片ID',
  `name` VARCHAR(100) NOT NULL COMMENT '图片名称',
  `description` TEXT DEFAULT NULL COMMENT '图片描述',
  `url` VARCHAR(255) NOT NULL COMMENT '图片URL',
  `thumbnail` VARCHAR(255) DEFAULT NULL COMMENT '缩略图URL',
  `categoryId` INT DEFAULT NULL COMMENT '分类ID',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_categoryId` (`categoryId`),
  KEY `idx_createdAt` (`createdAt`),
  CONSTRAINT `fk_image_category` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='图片表';

-- ============================================
-- 12. 视频表
-- ============================================
DROP TABLE IF EXISTS `video`;
CREATE TABLE `video` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '视频ID',
  `title` VARCHAR(200) NOT NULL COMMENT '视频标题',
  `description` TEXT DEFAULT NULL COMMENT '视频描述',
  `url` VARCHAR(255) NOT NULL COMMENT '视频文件URL',
  `cover` VARCHAR(255) DEFAULT NULL COMMENT '封面图片URL',
  `duration` INT DEFAULT NULL COMMENT '时长（秒）',
  `playCount` INT NOT NULL DEFAULT 0 COMMENT '播放次数',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_playCount` (`playCount`),
  KEY `idx_createdAt` (`createdAt`),
  KEY `idx_title` (`title`(50))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='视频表';

-- ============================================
-- 13. 主题表
-- ============================================
DROP TABLE IF EXISTS `theme`;
CREATE TABLE `theme` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '主题ID',
  `name` VARCHAR(50) NOT NULL COMMENT '主题名称',
  `primaryColor` VARCHAR(20) NOT NULL COMMENT '主色调',
  `secondaryColor` VARCHAR(20) NOT NULL COMMENT '次色调',
  `switchTime` VARCHAR(10) DEFAULT NULL COMMENT '定时切换时间（HH:mm格式）',
  `isEnabled` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否启用',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`),
  KEY `idx_isEnabled` (`isEnabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='主题表';

-- ============================================
-- 14. 系统配置表
-- ============================================
DROP TABLE IF EXISTS `system_config`;
CREATE TABLE `system_config` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `key` VARCHAR(100) NOT NULL COMMENT '配置键',
  `value` TEXT NOT NULL COMMENT '配置值',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- ============================================
-- 15. 访问日志表（可选，用于统计分析）
-- ============================================
DROP TABLE IF EXISTS `visit_log`;
CREATE TABLE `visit_log` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `ip` VARCHAR(45) DEFAULT NULL COMMENT '访问IP',
  `userAgent` VARCHAR(500) DEFAULT NULL COMMENT '用户代理',
  `path` VARCHAR(255) DEFAULT NULL COMMENT '访问路径',
  `method` VARCHAR(10) DEFAULT NULL COMMENT '请求方法',
  `statusCode` INT DEFAULT NULL COMMENT '状态码',
  `responseTime` INT DEFAULT NULL COMMENT '响应时间（毫秒）',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '访问时间',
  PRIMARY KEY (`id`),
  KEY `idx_ip` (`ip`),
  KEY `idx_path` (`path`),
  KEY `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='访问日志表';

-- ============================================
-- 初始化默认数据
-- ============================================

-- 插入默认管理员用户
-- 密码: admin123 (使用 bcryptjs 加密，cost factor: 10)
-- 生成方式: const bcrypt = require('bcryptjs'); bcrypt.hashSync('admin123', 10)
INSERT INTO `user` (`username`, `password`, `email`, `nickname`, `bio`) VALUES
('admin', '$2a$10$.ZzVZsAqEo5h9WJ2pL8wrOQcsnZEwEereuAP/cT1tCp5gaJOTaymi', 'admin@example.com', '管理员', '系统管理员账户');

-- 插入默认分类
INSERT INTO `category` (`name`, `description`) VALUES
('技术', '技术相关文章，包括编程、开发、架构等内容'),
('生活', '生活相关文章，记录日常生活的点点滴滴'),
('音乐', '音乐相关分类，用于音乐资源管理'),
('摄影', '摄影相关分类，用于图片资源管理'),
('前端', '前端开发相关技术文章'),
('后端', '后端开发相关技术文章'),
('数据库', '数据库相关技术文章'),
('DevOps', '运维和部署相关文章');

-- 插入默认标签
INSERT INTO `tag` (`name`) VALUES
('Vue3'),
('React'),
('TypeScript'),
('Node.js'),
('NestJS'),
('MySQL'),
('Redis'),
('Docker'),
('JavaScript'),
('Python'),
('Java'),
('Go'),
('算法'),
('设计模式'),
('架构'),
('微服务'),
('前端'),
('后端'),
('全栈'),
('开源');

-- 插入默认主题
INSERT INTO `theme` (`name`, `primaryColor`, `secondaryColor`, `isEnabled`) VALUES
('浅色', '#3b82f6', '#8b5cf6', 1),
('深色', '#60a5fa', '#a78bfa', 0),
('赛博朋克', '#00ff41', '#ff0080', 0);

-- 插入默认系统配置
INSERT INTO `system_config` (`key`, `value`) VALUES
('siteName', '个人博客'),
('siteDescription', '一个基于 Vue3 + NestJS 的个人博客系统'),
('siteKeywords', '博客,个人博客,Vue3,NestJS,TypeScript'),
('siteAuthor', '博主'),
('siteEmail', 'admin@example.com'),
('siteLogo', '/logo.png'),
('siteFavicon', '/favicon.ico'),
('beian', ''),
('github', 'https://github.com'),
('weibo', ''),
('qq', ''),
('wechat', '');

-- ============================================
-- 初始化完成
-- ============================================
-- 默认管理员账户:
--   用户名: admin
--   密码: admin123
--   邮箱: admin@example.com
-- 
-- 请在生产环境中及时修改默认密码！
-- ============================================
-- ============================================
-- 创建点赞和收藏表
-- ============================================
USE `blog`;

-- ============================================
-- 1. 文章点赞表
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
  KEY `idx_userId` (`userId`),
  CONSTRAINT `fk_article_like_article` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章点赞表';

-- ============================================
-- 2. 文章收藏表
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
  KEY `idx_userId` (`userId`),
  CONSTRAINT `fk_article_collect_article` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章收藏表';

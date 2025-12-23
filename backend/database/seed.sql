-- ============================================
-- 数据库种子数据脚本
-- ============================================
-- 说明: 此脚本用于插入测试数据，仅用于开发环境
-- ============================================

USE `blog`;

-- 插入示例文章
INSERT INTO `article` (`title`, `content`, `summary`, `cover`, `categoryId`, `views`, `likes`) VALUES
('Vue3 组合式 API 最佳实践', 
'# Vue3 组合式 API 最佳实践\n\nVue3 引入了组合式 API，让我们能够更好地组织和复用代码逻辑...\n\n## 什么是组合式 API\n\n组合式 API 是一组基于函数的 API，允许我们使用函数的方式组织组件逻辑...',
'本文介绍了 Vue3 组合式 API 的使用方法和最佳实践，帮助开发者更好地组织代码。',
'/images/article/vue3-api.jpg', 1, 120, 15),

('NestJS 从入门到精通',
'# NestJS 从入门到精通\n\nNestJS 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的框架...\n\n## 为什么选择 NestJS\n\nNestJS 提供了完整的 TypeScript 支持，采用模块化架构...',
'全面介绍 NestJS 框架的使用，包括模块、控制器、服务、中间件等核心概念。',
'/images/article/nestjs.jpg', 1, 89, 12),

('我的2024年度总结',
'# 我的2024年度总结\n\n2024年即将过去，回顾这一年，有收获也有遗憾...\n\n## 技术成长\n\n今年主要学习了 Vue3、NestJS、TypeScript 等新技术...',
'记录2024年的成长历程，包括技术学习、项目经验和个人感悟。',
'/images/article/2024-summary.jpg', 2, 56, 8);

-- 获取刚插入的文章ID并关联标签
SET @article1_id = LAST_INSERT_ID() - 2;
SET @article2_id = LAST_INSERT_ID() - 1;
SET @article3_id = LAST_INSERT_ID();

-- 关联文章和标签
INSERT INTO `article_tag` (`articleId`, `tagId`) VALUES
(@article1_id, (SELECT id FROM tag WHERE name = 'Vue3' LIMIT 1)),
(@article1_id, (SELECT id FROM tag WHERE name = 'TypeScript' LIMIT 1)),
(@article1_id, (SELECT id FROM tag WHERE name = '前端' LIMIT 1)),
(@article2_id, (SELECT id FROM tag WHERE name = 'NestJS' LIMIT 1)),
(@article2_id, (SELECT id FROM tag WHERE name = 'Node.js' LIMIT 1)),
(@article2_id, (SELECT id FROM tag WHERE name = '后端' LIMIT 1)),
(@article3_id, (SELECT id FROM tag WHERE name = '生活' LIMIT 1));

-- 插入示例音乐
INSERT INTO `music` (`name`, `artist`, `cover`, `url`, `duration`, `playCount`) VALUES
('夜空中最亮的星', '逃跑计划', '/images/music/escape-plan.jpg', '/music/escape-plan.mp3', 280, 1250),
('成都', '赵雷', '/images/music/chengdu.jpg', '/music/chengdu.mp3', 320, 980),
('理想', '赵雷', '/images/music/lixiang.jpg', '/music/lixiang.mp3', 295, 756);

-- 插入示例图片
INSERT INTO `image` (`name`, `description`, `url`, `thumbnail`, `categoryId`) VALUES
('日落', '美丽的日落景色', '/images/gallery/sunset.jpg', '/images/gallery/thumbnails/sunset_thumb.jpg', 4),
('城市夜景', '繁华的城市夜景', '/images/gallery/city-night.jpg', '/images/gallery/thumbnails/city-night_thumb.jpg', 4),
('自然风光', '大自然的美丽', '/images/gallery/nature.jpg', '/images/gallery/thumbnails/nature_thumb.jpg', 4);

-- 插入示例视频
INSERT INTO `video` (`title`, `description`, `url`, `cover`, `duration`, `playCount`) VALUES
('Vue3 实战教程', 'Vue3 从零开始构建项目', '/videos/vue3-tutorial.mp4', '/images/videos/vue3-tutorial.jpg', 3600, 450),
('NestJS 入门指南', 'NestJS 框架快速入门', '/videos/nestjs-guide.mp4', '/images/videos/nestjs-guide.jpg', 2400, 320);

-- ============================================
-- 种子数据插入完成
-- ============================================


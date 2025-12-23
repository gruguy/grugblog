-- ============================================
-- 数据库修复脚本
-- 用于修复外键约束类型不匹配问题
-- ============================================

USE `blog`;

-- 删除外键约束
ALTER TABLE `article_tag` DROP FOREIGN KEY IF EXISTS `fk_article_tag_article`;
ALTER TABLE `article_tag` DROP FOREIGN KEY IF EXISTS `fk_article_tag_tag`;
ALTER TABLE `article` DROP FOREIGN KEY IF EXISTS `fk_article_category`;
ALTER TABLE `image` DROP FOREIGN KEY IF EXISTS `fk_image_category`;

-- 删除表（按依赖顺序）
DROP TABLE IF EXISTS `article_tag`;
DROP TABLE IF EXISTS `article`;
DROP TABLE IF EXISTS `image`;
DROP TABLE IF EXISTS `music`;
DROP TABLE IF EXISTS `video`;
DROP TABLE IF EXISTS `tag`;
DROP TABLE IF EXISTS `category`;
DROP TABLE IF EXISTS `theme`;
DROP TABLE IF EXISTS `system_config`;
DROP TABLE IF EXISTS `visit_log`;
DROP TABLE IF EXISTS `user`;

-- 重新执行 init.sql 创建表结构
-- 或者手动执行以下 SQL（从 init.sql 复制）


const mysql = require('mysql2/promise');

async function checkAndCreateMediaTables() {
  try {
    console.log('开始检查和创建媒体表...');
    
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'Gruguy31',
      database: 'blog'
    });
    
    console.log('数据库连接成功');
    
    // 检查并创建音乐表
    const [musicTable] = await connection.query('SHOW TABLES LIKE "music"');
    if (musicTable.length === 0) {
      console.log('创建音乐表...');
      await connection.query(`
        CREATE TABLE \`music\` (
          \`id\` INT NOT NULL AUTO_INCREMENT COMMENT '音乐ID',
          \`title\` VARCHAR(200) NOT NULL COMMENT '音乐标题',
          \`artist\` VARCHAR(200) NOT NULL COMMENT '艺术家',
          \`album\` VARCHAR(200) DEFAULT NULL COMMENT '专辑',
          \`duration\` INT DEFAULT NULL COMMENT '时长（秒）',
          \`url\` VARCHAR(255) NOT NULL COMMENT '音乐文件URL',
          \`cover\` VARCHAR(255) DEFAULT NULL COMMENT '封面图URL',
          \`lyrics\` TEXT DEFAULT NULL COMMENT '歌词',
          \`userId\` INT NOT NULL COMMENT '用户ID',
          \`categoryId\` INT DEFAULT NULL COMMENT '分类ID',
          \`scores\` INT DEFAULT NULL COMMENT '评分',
          \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
          \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
          PRIMARY KEY (\`id\`),
          KEY \`idx_userId\` (\`userId\`),
          KEY \`idx_categoryId\` (\`categoryId\`),
          CONSTRAINT \`fk_music_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='音乐表';
      `);
      console.log('✅ 音乐表创建成功');
    } else {
      console.log('✅ 音乐表已存在');
    }
    
    // 检查并创建图片表
    const [imageTable] = await connection.query('SHOW TABLES LIKE "image"');
    if (imageTable.length === 0) {
      console.log('创建图片表...');
      await connection.query(`
        CREATE TABLE \`image\` (
          \`id\` INT NOT NULL AUTO_INCREMENT COMMENT '图片ID',
          \`title\` VARCHAR(200) NOT NULL COMMENT '图片标题',
          \`description\` TEXT DEFAULT NULL COMMENT '图片描述',
          \`url\` VARCHAR(255) NOT NULL COMMENT '图片URL',
          \`userId\` INT NOT NULL COMMENT '用户ID',
          \`categoryId\` INT DEFAULT NULL COMMENT '分类ID',
          \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
          \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
          PRIMARY KEY (\`id\`),
          KEY \`idx_userId\` (\`userId\`),
          KEY \`idx_categoryId\` (\`categoryId\`),
          CONSTRAINT \`fk_image_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='图片表';
      `);
      console.log('✅ 图片表创建成功');
    } else {
      console.log('✅ 图片表已存在');
    }
    
    // 检查并创建视频表
    const [videoTable] = await connection.query('SHOW TABLES LIKE "video"');
    if (videoTable.length === 0) {
      console.log('创建视频表...');
      await connection.query(`
        CREATE TABLE \`video\` (
          \`id\` INT NOT NULL AUTO_INCREMENT COMMENT '视频ID',
          \`title\` VARCHAR(200) NOT NULL COMMENT '视频标题',
          \`description\` TEXT DEFAULT NULL COMMENT '视频描述',
          \`url\` VARCHAR(255) NOT NULL COMMENT '视频URL',
          \`cover\` VARCHAR(255) DEFAULT NULL COMMENT '封面图URL',
          \`duration\` INT DEFAULT NULL COMMENT '时长（秒）',
          \`userId\` INT NOT NULL COMMENT '用户ID',
          \`categoryId\` INT DEFAULT NULL COMMENT '分类ID',
          \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
          \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
          PRIMARY KEY (\`id\`),
          KEY \`idx_userId\` (\`userId\`),
          KEY \`idx_categoryId\` (\`categoryId\`),
          CONSTRAINT \`fk_video_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='视频表';
      `);
      console.log('✅ 视频表创建成功');
    } else {
      console.log('✅ 视频表已存在');
    }
    
    await connection.end();
    console.log('✅ 媒体表检查和创建完成！');
    
  } catch (error) {
    console.error('❌ 执行失败:', error);
    process.exit(1);
  }
}

checkAndCreateMediaTables();

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// 读取 .env 文件
require('dotenv').config();

async function checkMusicTable() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DB || 'blog',
      multipleStatements: true
    });

    console.log('成功连接到数据库');

    // 查询 music 表的完整结构
    console.log('\n--- 查询 music 表的完整结构 ---');
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, COLUMN_COMMENT, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'music'
      ORDER BY ORDINAL_POSITION;
    `);

    console.log('music 表的列信息:');
    columns.forEach((column) => {
      console.log(`${column.COLUMN_NAME} (${column.DATA_TYPE}) - ${column.COLUMN_COMMENT} (允许为空: ${column.IS_NULLABLE})`);
    });

    // 检查是否有 scores 列
    const hasScoresColumn = columns.some(column => column.COLUMN_NAME === 'scores');
    console.log(`\n是否包含 scores 字段: ${hasScoresColumn ? '是' : '否'}`);

    // 关闭连接
    await connection.end();
    console.log('\n数据库连接已关闭');
  } catch (error) {
    console.error('检查数据库表时出错:', error);
    process.exit(1);
  }
}

checkMusicTable();

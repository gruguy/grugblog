const mysql = require('mysql2');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 创建数据库连接
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'Gruguy31',
  database: process.env.MYSQL_DB || 'blog',
});

// 连接到数据库
connection.connect((err) => {
  if (err) {
    console.error('连接数据库失败:', err);
    process.exit(1);
  }
  console.log('成功连接到数据库');
  
  // 检查music表结构
  checkMusicTable();
});

function checkMusicTable() {
  console.log('\n=== 检查music表结构 ===');
  
  // 查询表结构
  connection.query('DESCRIBE music;', (err, results) => {
    if (err) {
      console.error('查询表结构失败:', err);
      connection.end();
      return;
    }
    
    console.log('当前表结构:');
    results.forEach((column) => {
      console.log(`${column.Field}: ${column.Type} ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
    });
    
    // 检查是否存在scores字段
    const hasScoresColumn = results.some(column => column.Field === 'scores');
    
    if (hasScoresColumn) {
      console.log('\n✅ scores字段已存在于music表中');
      connection.end();
    } else {
      console.log('\n❌ scores字段不存在于music表中，正在添加...');
      addScoresColumn();
    }
  });
}

function addScoresColumn() {
  // 添加scores字段
  const alterQuery = 'ALTER TABLE music ADD COLUMN scores JSON NULL DEFAULT NULL;';
  
  connection.query(alterQuery, (err, results) => {
    if (err) {
      console.error('添加scores字段失败:', err);
      connection.end();
      return;
    }
    
    console.log('✅ 成功添加scores字段到music表中');
    
    // 再次检查表结构，确认字段已添加
    checkMusicTable();
  });
}

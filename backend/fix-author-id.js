require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixAuthorId() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'Gruguy31',
      database: process.env.MYSQL_DB || 'blog'
    });

    console.log('数据库连接成功');

    // 1. 检查是否有用户存在
    const [users] = await connection.execute('SELECT id FROM user LIMIT 1');
    if (users.length === 0) {
      console.error('数据库中没有用户，请先创建用户');
      await connection.end();
      return;
    }

    const defaultUserId = users[0].id;
    console.log(`使用默认用户ID: ${defaultUserId}`);

    // 2. 更新所有authorId为null的文章
    const [updateResult] = await connection.execute(
      'UPDATE article SET authorId = ? WHERE authorId IS NULL AND status = ?',
      [defaultUserId, 'published']
    );

    console.log(`已更新 ${updateResult.affectedRows} 篇文章的authorId`);

    // 3. 验证更新结果
    const [updatedArticles] = await connection.execute(
      'SELECT COUNT(*) as count FROM article WHERE authorId IS NULL AND status = ?',
      ['published']
    );

    console.log(`剩余 ${updatedArticles[0].count} 篇已发布文章的authorId为null`);

    // 4. 检查用户文章数量
    const [userArticles] = await connection.execute(
      'SELECT u.id, u.username, COUNT(a.id) as articleCount FROM user u LEFT JOIN article a ON u.id = a.authorId AND a.status = "published" GROUP BY u.id'
    );

    console.log('用户文章统计:');
    userArticles.forEach(user => {
      console.log(`${user.username} (ID: ${user.id}): ${user.articleCount} 篇文章`);
    });

    await connection.end();
    console.log('修复完成');
  } catch (error) {
    console.error('修复过程中发生错误:', error);
  }
}

fixAuthorId();

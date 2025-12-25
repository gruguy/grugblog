const mysql = require("mysql2/promise");

// 数据库配置
const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Gruguy31",
  database: "blog",
};

async function testLikeCollect() {
  let connection;

  try {
    // 连接数据库
    connection = await mysql.createConnection(dbConfig);
    console.log("成功连接到数据库");

    // 测试文章ID
    const articleId = 1;
    // 测试用户ID
    const userId = 1;

    console.log(`\n测试文章ID: ${articleId}`);
    console.log(`测试用户ID: ${userId}`);

    // 1. 测试点赞功能
    console.log("\n1. 测试点赞功能:");
    // 插入点赞记录
    const [likeResult] = await connection.execute(
      `INSERT INTO article_like (userId, articleId) VALUES (?, ?) ON DUPLICATE KEY UPDATE createdAt = NOW()`,
      [userId, articleId]
    );
    console.log("点赞操作结果:", likeResult);

    // 更新文章点赞数
    await connection.execute(
      `UPDATE article SET likes = (SELECT COUNT(*) FROM article_like WHERE articleId = ?) WHERE id = ?`,
      [articleId, articleId]
    );
    console.log("文章点赞数已更新");

    // 2. 测试收藏功能
    console.log("\n2. 测试收藏功能:");
    // 插入收藏记录
    const [collectResult] = await connection.execute(
      `INSERT INTO article_collect (userId, articleId) VALUES (?, ?) ON DUPLICATE KEY UPDATE createdAt = NOW()`,
      [userId, articleId]
    );
    console.log("收藏操作结果:", collectResult);

    // 3. 测试查询功能
    console.log("\n3. 测试查询功能:");
    // 查询点赞状态
    const [likeStatus] = await connection.execute(
      `SELECT * FROM article_like WHERE userId = ? AND articleId = ?`,
      [userId, articleId]
    );
    console.log("点赞状态:", likeStatus.length > 0 ? "已点赞" : "未点赞");

    // 查询收藏状态
    const [collectStatus] = await connection.execute(
      `SELECT * FROM article_collect WHERE userId = ? AND articleId = ?`,
      [userId, articleId]
    );
    console.log("收藏状态:", collectStatus.length > 0 ? "已收藏" : "未收藏");

    // 查询文章点赞数
    const [article] = await connection.execute(
      `SELECT likes FROM article WHERE id = ?`,
      [articleId]
    );
    console.log("文章点赞数:", article[0]?.likes || 0);

    // 4. 测试取消点赞功能
    console.log("\n4. 测试取消点赞功能:");
    const [unlikeResult] = await connection.execute(
      `DELETE FROM article_like WHERE userId = ? AND articleId = ?`,
      [userId, articleId]
    );
    console.log("取消点赞操作结果:", unlikeResult);

    // 更新文章点赞数
    await connection.execute(
      `UPDATE article SET likes = (SELECT COUNT(*) FROM article_like WHERE articleId = ?) WHERE id = ?`,
      [articleId, articleId]
    );
    console.log("文章点赞数已更新");

    // 查询最新点赞数
    const [updatedArticle] = await connection.execute(
      `SELECT likes FROM article WHERE id = ?`,
      [articleId]
    );
    console.log("最新文章点赞数:", updatedArticle[0]?.likes || 0);

    console.log("\n测试完成!");
  } catch (error) {
    console.error("测试失败:", error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log("数据库连接已关闭");
    }
  }
}

// 执行测试
testLikeCollect();
const mysql = require("mysql2/promise");

async function executeSQL() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "Gruguy31",
      database: "blog",
    });

    console.log("数据库连接成功");

    // 执行SQL语句 - 分开执行每个语句
    const sqlStatements = [
      // 修复system_config表中的重复空key值
      `UPDATE \`system_config\` SET \`key\` = 'empty_key_fix' WHERE \`key\` = ''`,

      // 创建comment表
      `DROP TABLE IF EXISTS \`comment\``,

      `CREATE TABLE \`comment\` (
        \`id\` INT NOT NULL AUTO_INCREMENT COMMENT '评论ID',
        \`content\` TEXT NOT NULL COMMENT '评论内容',
        \`author\` VARCHAR(50) NOT NULL COMMENT '评论作者',
        \`articleId\` INT NOT NULL COMMENT '文章ID',
        \`userId\` INT NOT NULL COMMENT '用户ID',
        \`parentId\` INT NULL DEFAULT NULL COMMENT '父评论ID，用于回复功能',
        \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        PRIMARY KEY (\`id\`),
        KEY \`idx_articleId\` (\`articleId\`),
        KEY \`idx_userId\` (\`userId\`),
        KEY \`idx_parentId\` (\`parentId\`),
        KEY \`idx_createdAt\` (\`createdAt\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表'`,
    ];

    // 依次执行每个SQL语句
    for (const sql of sqlStatements) {
      await connection.query(sql);
      console.log("执行SQL成功:", sql.substring(0, 50) + "...");
    }

    console.log("所有SQL执行成功");

    // 关闭连接
    await connection.end();
    console.log("数据库连接已关闭");
  } catch (error) {
    console.error("执行SQL失败:", error);
    process.exit(1);
  }
}

executeSQL();

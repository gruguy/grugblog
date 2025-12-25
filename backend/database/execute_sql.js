const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

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

    // 读取并执行fix_comment_table.sql文件
    const fixCommentSqlPath = path.join(__dirname, "fix_comment_table.sql");
    const fixCommentSqlContent = fs.readFileSync(fixCommentSqlPath, "utf8");
    await executeSqlFile(connection, fixCommentSqlContent, "fix_comment_table.sql");

    // 读取并执行create_like_collect_tables.sql文件
    const likeCollectSqlPath = path.join(__dirname, "create_like_collect_tables.sql");
    const likeCollectSqlContent = fs.readFileSync(likeCollectSqlPath, "utf8");
    await executeSqlFile(connection, likeCollectSqlContent, "create_like_collect_tables.sql");

    console.log("所有SQL执行成功");

    // 关闭连接
    await connection.end();
    console.log("数据库连接已关闭");
  } catch (error) {
    console.error("执行SQL失败:", error);
    process.exit(1);
  }
}

async function executeSqlFile(connection, sqlContent, fileName) {
  // 分割SQL语句（按分号分割，但要注意字符串中的分号）
  const sqlStatements = sqlContent
    .replace(/\\'/g, "''") // 处理转义引号
    .split(/;(?=\s*$)/m) // 按分号分割，只匹配行尾的分号
    .filter((statement) => statement.trim() !== "") // 过滤空语句
    .map((statement) => statement.trim() + ";"); // 确保每个语句都以分号结尾

  // 依次执行每个SQL语句
  for (const sql of sqlStatements) {
    await connection.query(sql);
    console.log(`执行${fileName}成功:`, sql.substring(0, 50) + "...");
  }
}

executeSQL();

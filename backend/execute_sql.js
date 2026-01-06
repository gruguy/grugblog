const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// 读取 .env 文件
require("dotenv").config();

async function executeSQLScript() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || "localhost",
      port: parseInt(process.env.MYSQL_PORT || "3306"),
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DB || "blog",
      multipleStatements: true,
    });

    console.log("成功连接到数据库");

    // 读取 SQL 脚本文件
    const sqlFilePath = path.join(
      __dirname,
      "database",
      "fix_add_scores_column.sql"
    );
    const sqlScript = fs.readFileSync(sqlFilePath, "utf8");

    console.log("正在执行 SQL 脚本...");

    // 执行 SQL 脚本
    // 使用 query 方法而不是 execute 方法，支持更多 SQL 命令
    const results = await connection.query(sqlScript);

    console.log("SQL 脚本执行成功");
    console.log("结果:", results);

    // 关闭连接
    await connection.end();
    console.log("数据库连接已关闭");
  } catch (error) {
    console.error("执行 SQL 脚本时出错:", error);
    process.exit(1);
  }
}

executeSQLScript();

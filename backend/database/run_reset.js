const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function runResetSql() {
  try {
    // 创建数据库连接（不指定database，因为我们要先删除并重新创建）
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "Gruguy31",
    });

    console.log("数据库连接成功");

    // 读取reset.sql文件内容
    const resetSqlPath = path.join(__dirname, "reset.sql");
    const resetSql = fs.readFileSync(resetSqlPath, "utf8");

    // 分割SQL语句（按分号和换行分割）
    // 处理注释和空行，确保正确分割
    const sqlStatements = resetSql
      // 先移除行内注释（-- 开头的注释）
      .replace(/--.*$/gm, "")
      // 按分号分割
      .split(";")
      // 清理每个语句
      .map((statement) => statement.trim())
      // 过滤掉空语句
      .filter((statement) => statement.length > 0);

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

runResetSql();

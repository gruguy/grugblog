const mysql = require("mysql2/promise");

// 数据库配置
const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Gruguy31",
  database: "blog",
};

// 测试用户数据
const testUser = {
  username: "admin",
  password: "$2a$10$OUeF3i3fPRXpcVTSCYbDIujLKM.h0gSnxmDZHIpFXE3MvtZUxqChW", // 123456的哈希值
  email: "admin@example.com",
  nickname: "管理员",
  bio: "系统管理员",
};

async function createTestUser() {
  let connection;

  try {
    // 连接数据库
    connection = await mysql.createConnection(dbConfig);
    console.log("成功连接到数据库");

    // 插入或更新测试用户
    const [result] = await connection.execute(
      `INSERT INTO user (username, password, email, nickname, bio, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
         password = VALUES(password),
         email = VALUES(email),
         nickname = VALUES(nickname),
         bio = VALUES(bio),
         updatedAt = NOW()`,
      [
        testUser.username,
        testUser.password,
        testUser.email,
        testUser.nickname,
        testUser.bio,
      ]
    );

    if (result.affectedRows > 0) {
      console.log(`测试用户 ${testUser.username} 创建/更新成功`);
    } else {
      console.log(`测试用户 ${testUser.username} 没有变化`);
    }

    // 查询创建的用户
    const [rows] = await connection.execute(
      `SELECT id, username, email, nickname, bio, createdAt, updatedAt FROM user WHERE username = ?`,
      [testUser.username]
    );

    console.log("创建的测试用户信息:");
    console.log(rows[0]);
  } catch (error) {
    console.error("创建测试用户失败:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("数据库连接已关闭");
    }
    process.exit(0);
  }
}

// 执行创建测试用户函数
createTestUser();

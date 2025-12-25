const bcrypt = require("bcryptjs");

// 生成123456的bcrypt哈希值
bcrypt.hash("123456", 10, (err, hash) => {
  if (err) {
    console.error("生成哈希值失败:", err);
    process.exit(1);
  }

  console.log('密码 "123456" 的bcrypt哈希值:');
  console.log(hash);

  // 验证哈希值
  bcrypt.compare("123456", hash, (err, result) => {
    if (err) {
      console.error("验证哈希值失败:", err);
      process.exit(1);
    }

    console.log("\n验证结果:", result ? "成功" : "失败");
    process.exit(0);
  });
});

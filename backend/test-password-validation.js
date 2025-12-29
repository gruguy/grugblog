const bcrypt = require('bcryptjs');

// 测试密码验证
async function testPasswordValidation() {
  // 默认用户的加密密码（来自init.sql）
  const hashedPassword = '$2a$10$.ZzVZsAqEo5h9WJ2pL8wrOQcsnZEwEereuAP/cT1tCp5gaJOTaymi';
  
  // 测试密码
  const testPasswords = ['admin123', 'wrongpassword'];
  
  console.log('开始测试密码验证...');
  
  for (const password of testPasswords) {
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log(`密码 '${password}' 验证结果: ${isValid}`);
  }
  
  console.log('测试完成');
}

testPasswordValidation().catch(console.error);

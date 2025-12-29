const bcrypt = require('bcryptjs');

// 从init.sql获取的哈希密码
const hashedPassword = '$2a$10$.ZzVZsAqEo5h9WJ2pL8wrOQcsnZEwEereuAP/cT1tCp5gaJOTaymi';
// 预期的明文密码
const plainPassword = 'admin123';

// 验证密码
async function verifyPassword() {
  try {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('密码验证结果:', isValid);
    console.log('明文密码:', plainPassword);
    console.log('哈希密码:', hashedPassword);
    
    // 重新生成哈希，验证哈希过程是否正确
    const newHash = await bcrypt.hash(plainPassword, 10);
    console.log('重新生成的哈希:', newHash);
    console.log('两次哈希是否相同:', hashedPassword === newHash);
  } catch (error) {
    console.error('验证失败:', error);
  }
}

verifyPassword();
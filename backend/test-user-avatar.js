const mysql = require('mysql2/promise');

// 测试脚本：检查用户表中的avatar字段值
async function testUserAvatar() {
  try {
    console.log('开始检查用户表中的avatar字段...');

    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'Gruguy31',
      database: 'blog',
    });

    console.log('数据库连接成功');

    // 1. 检查表结构，确认avatar字段是否存在
    console.log('\n1. 检查表结构：');
    const [columns] = await connection.execute(
      'DESCRIBE user'
    );
    
    console.log('user表字段列表:');
    columns.forEach(col => {
      console.log(`${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default || ''}`);
    });

    // 2. 检查用户数据，查看avatar字段值
    console.log('\n2. 检查用户数据，查看avatar字段值：');
    const [users] = await connection.execute(
      'SELECT id, username, email, avatar FROM user'
    );
    
    if (users.length > 0) {
      console.log('用户列表:');
      users.forEach(user => {
        console.log(`ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Avatar: ${user.avatar || 'NULL'}`);
      });
      
      // 检查是否有用户的avatar字段不为null
      const hasUserWithAvatar = users.some(user => user.avatar !== null);
      if (hasUserWithAvatar) {
        console.log('\n✅ 发现有用户的avatar字段不为null');
      } else {
        console.log('\n❌ 所有用户的avatar字段均为null');
      }
    } else {
      console.log('\n❌ 没有找到用户数据');
    }

    // 3. 更新用户avatar字段，测试评论头像保存
    console.log('\n3. 更新用户avatar字段，测试评论头像保存：');
    const testUserId = 1; // 假设用户ID 1 存在
    const testAvatarUrl = 'https://example.com/test-avatar.jpg';
    
    await connection.execute(
      'UPDATE user SET avatar = ? WHERE id = ?',
      [testAvatarUrl, testUserId]
    );
    
    console.log(`✅ 已将用户ID ${testUserId} 的avatar字段更新为: ${testAvatarUrl}`);
    
    // 4. 再次检查用户数据，确认avatar字段已更新
    const [updatedUsers] = await connection.execute(
      'SELECT id, username, email, avatar FROM user WHERE id = ?',
      [testUserId]
    );
    
    if (updatedUsers.length > 0) {
      const updatedUser = updatedUsers[0];
      console.log(`\n✅ 更新后用户信息: ID: ${updatedUser.id}, Avatar: ${updatedUser.avatar}`);
    }

    // 5. 关闭数据库连接
    await connection.end();
    console.log('\n✅ 测试完成，数据库连接已关闭');

  } catch (error) {
    console.error('测试过程中发生错误:', error);
    process.exit(1);
  }
}

// 运行测试
testUserAvatar();

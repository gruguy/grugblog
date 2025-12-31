const mysql = require('mysql2/promise');

// 简单测试脚本：直接使用MySQL客户端测试评论头像字段
async function testCommentAvatarSave() {
  try {
    console.log('开始测试评论头像保存功能...');

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
      'DESCRIBE comment'
    );
    
    console.log('comment表字段列表:');
    columns.forEach(col => {
      console.log(`${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default || ''}`);
    });
    
    // 检查avatar字段是否存在
    const hasAvatarColumn = columns.some(col => col.Field === 'avatar');
    if (hasAvatarColumn) {
      console.log('✅ 检查通过：comment表已包含avatar字段');
    } else {
      console.log('❌ 检查失败：comment表缺少avatar字段');
      await connection.end();
      return;
    }

    // 2. 测试插入包含头像的评论
    console.log('\n2. 测试插入包含头像的评论：');
    const testAvatarUrl = 'https://example.com/test-avatar.jpg';
    const [insertResult] = await connection.execute(
      'INSERT INTO comment (content, author, articleId, userId, avatar, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      ['测试评论内容 - 头像保存测试', '测试用户', 1, 1, testAvatarUrl]
    );
    
    const commentId = insertResult.insertId;
    console.log(`✅ 成功插入评论，ID: ${commentId}`);

    // 3. 测试查询刚刚插入的评论，验证头像是否正确保存
    console.log('\n3. 测试查询评论，验证头像是否保存：');
    const [selectResult] = await connection.execute(
      'SELECT id, content, author, avatar FROM comment WHERE id = ?',
      [commentId]
    );
    
    if (selectResult.length > 0) {
      const savedComment = selectResult[0];
      console.log('查询到的评论:', savedComment);
      
      if (savedComment.avatar === testAvatarUrl) {
        console.log('✅ 测试成功：评论头像正确保存到数据库');
      } else {
        console.log('❌ 测试失败：评论头像没有正确保存到数据库');
        console.log('期望头像:', testAvatarUrl);
        console.log('实际头像:', savedComment.avatar);
      }
    } else {
      console.log('❌ 测试失败：无法查询到刚刚插入的评论');
    }

    // 4. 清理测试数据
    console.log('\n4. 清理测试数据：');
    await connection.execute('DELETE FROM comment WHERE id = ?', [commentId]);
    console.log('✅ 测试数据清理成功');

    // 5. 关闭数据库连接
    await connection.end();
    console.log('\n✅ 测试完成，所有步骤执行成功！');

  } catch (error) {
    console.error('测试过程中发生错误:', error);
    process.exit(1);
  }
}

// 运行测试
testCommentAvatarSave();

import { createConnection } from 'typeorm';
import { Comment } from './src/modules/comment/entities/comment.entity';

// 简化测试脚本：只验证评论头像字段是否能正确保存
async function testCommentAvatarSave() {
  try {
    console.log('开始测试评论头像保存功能...');

    // 创建数据库连接
    const connection = await createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Gruguy31',
      database: 'blog',
      entities: [Comment],
      synchronize: false,
      logging: true,
    });

    console.log('数据库连接成功');

    // 获取评论仓库
    const commentRepository = connection.getRepository(Comment);

    // 准备测试数据
    const testAvatarUrl = 'https://example.com/test-avatar.jpg';
    const testCommentData = {
      content: '测试评论内容 - 头像保存测试',
      author: '测试用户',
      articleId: 1, // 假设文章ID 1 存在
      userId: 1,     // 假设用户ID 1 存在
      avatar: testAvatarUrl,
    };

    console.log('准备保存的评论数据:', testCommentData);

    // 创建并保存评论
    const comment = commentRepository.create(testCommentData);
    const savedComment = await commentRepository.save(comment);
    
    console.log('保存后的评论数据:', savedComment);
    console.log('评论ID:', savedComment.id);
    console.log('头像字段:', savedComment.avatar);

    // 验证头像是否保存成功
    if (savedComment.avatar === testAvatarUrl) {
      console.log('✅ 测试成功：评论头像正确保存到数据库');
    } else {
      console.log('❌ 测试失败：评论头像没有正确保存到数据库');
      console.log('期望头像:', testAvatarUrl);
      console.log('实际头像:', savedComment.avatar);
    }

    // 从数据库中重新查询，验证数据持久化
    const reloadedComment = await commentRepository.findOne({
      where: { id: savedComment.id }
    });
    console.log('从数据库重新查询的评论:', reloadedComment);
    
    if (reloadedComment?.avatar === testAvatarUrl) {
      console.log('✅ 测试成功：数据库中持久化了头像数据');
    } else {
      console.log('❌ 测试失败：数据库中没有持久化头像数据');
      console.log('期望头像:', testAvatarUrl);
      console.log('实际头像:', reloadedComment?.avatar);
    }

    // 清理测试数据
    await commentRepository.delete(savedComment.id);
    console.log('清理测试数据成功');

    // 关闭数据库连接
    await connection.close();
    console.log('数据库连接已关闭');
    console.log('测试完成');

  } catch (error) {
    console.error('测试过程中发生错误:', error);
    process.exit(1);
  }
}

// 运行测试
testCommentAvatarSave();

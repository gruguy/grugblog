const Redis = require('ioredis');

async function clearRedisCache() {
  try {
    console.log('开始清除Redis缓存...');
    
    // 创建Redis客户端
    const redis = new Redis({
      host: 'localhost',
      port: 6379
    });

    redis.on('error', (err) => console.error('Redis Client Error', err));

    console.log('Redis连接成功');

    // 清除所有文章相关的缓存
    const keys = await redis.keys('articles:*');
    console.log(`找到 ${keys.length} 个文章相关缓存键`);
    
    if (keys.length > 0) {
      await redis.del(keys);
      console.log('✅ 成功清除所有文章缓存');
    } else {
      console.log('ℹ️  没有找到文章相关缓存');
    }

    // 清除内容活动数据缓存
    const activityKeys = await redis.keys('content:activity:*');
    console.log(`找到 ${activityKeys.length} 个活动数据缓存键`);
    
    if (activityKeys.length > 0) {
      await redis.del(activityKeys);
      console.log('✅ 成功清除所有活动数据缓存');
    } else {
      console.log('ℹ️  没有找到活动数据缓存');
    }

    await redis.disconnect();
    console.log('✅ Redis缓存清理完成！');
    
  } catch (error) {
    console.error('❌ 清除Redis缓存失败:', error);
  }
}

clearRedisCache();

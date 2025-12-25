const Redis = require('ioredis');

// 创建Redis客户端
const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

async function clearCache() {
  try {
    // 清除分类缓存
    await redis.del('articles:categories');
    console.log('Redis缓存已清除: articles:categories');
    
    // 获取分类数据，验证是否包含articleCount字段
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/articles/categories',
      method: 'GET'
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('\n最新分类数据:', response.data);
          if (response.data && response.data.length > 0) {
            console.log('\n第一个分类:', response.data[0]);
            console.log('是否包含articleCount:', 'articleCount' in response.data[0]);
          }
        } catch (error) {
          console.error('解析响应失败:', error);
        } finally {
          redis.disconnect();
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('请求失败:', error);
      redis.disconnect();
    });
    
    req.end();
  } catch (error) {
    console.error('清除缓存失败:', error);
    redis.disconnect();
  }
}

clearCache();
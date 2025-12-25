const http = require('http');

// 发送请求获取分类数据
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
      console.log('完整响应:', JSON.stringify(response, null, 2));
      
      // 检查分类数据是否包含articleCount字段
      if (response.data && Array.isArray(response.data)) {
        console.log('\n分类数据:', response.data);
        console.log('\n第一个分类:', response.data[0]);
        console.log('是否包含articleCount:', 'articleCount' in response.data[0]);
      }
    } catch (error) {
      console.error('解析JSON失败:', error);
      console.log('原始响应:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('请求失败:', error);
});

req.end();
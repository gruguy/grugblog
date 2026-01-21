const http = require('http');

// 测试用户注册
function registerUser() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      username: 'testuser',
      password: 'test123',
      email: 'test@example.com',
      nickname: 'Test User',
      captchaToken: 'test-token'
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ statusCode: res.statusCode, response });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// 测试用户登录
function loginUser(username, password) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ username, password });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ statusCode: res.statusCode, response });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// 测试活动端点
function testActivityEndpoint(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/articles/activity',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ statusCode: res.statusCode, response });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// 运行测试
async function runTests() {
  try {
    console.log('=== 开始测试活动端点 ===\n');

    // 1. 测试注册
    console.log('1. 测试用户注册...');
    const registerResult = await registerUser();
    console.log(`   状态码: ${registerResult.statusCode}`);
    console.log(`   响应: ${JSON.stringify(registerResult.response, null, 2)}`);
    console.log();

    // 2. 测试登录
    console.log('2. 测试用户登录...');
    const loginResult = await loginUser('testuser', 'test123');
    console.log(`   状态码: ${loginResult.statusCode}`);
    console.log(`   响应: ${JSON.stringify(loginResult.response, null, 2)}`);
    console.log();

    // 3. 测试活动端点
    if (loginResult.response.data?.token) {
      console.log('3. 测试活动端点...');
      const activityResult = await testActivityEndpoint(loginResult.response.data.token);
      console.log(`   状态码: ${activityResult.statusCode}`);
      console.log(`   响应: ${JSON.stringify(activityResult.response, null, 2)}`);
      console.log();
    } else {
      console.log('3. 登录失败，无法测试活动端点');
      console.log();
    }

    console.log('=== 测试完成 ===');

  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

runTests();

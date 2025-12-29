const axios = require("axios");

// 测试登录接口
async function testLogin() {
  const loginData = {
    username: "admin",
    password: "admin123",
  };

  try {
    console.log("发送登录请求:", loginData);
    const response = await axios.post(
      "http://localhost:3000/api/auth/login",
      loginData
    );
    console.log("登录成功，响应数据:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "登录失败，错误信息:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

testLogin().catch(console.error);

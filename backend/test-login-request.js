const axios = require("axios");

// 测试登录请求
async function testLogin() {
  try {
    const response = await axios.post("http://localhost:3000/api/auth/login", {
      username: "admin",
      password: "admin123",
    });

    console.log("登录成功:", response.data);
  } catch (error) {
    console.error("登录失败:", error.response?.data || error.message);
    console.error("状态码:", error.response?.status);
  }
}

testLogin();

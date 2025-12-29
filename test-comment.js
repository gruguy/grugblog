const axios = require("axios");

async function testCommentCreation() {
  try {
    console.log("测试创建评论...");
    const response = await axios.post("http://localhost:3000/api/comments", {
      content: "测试评论内容",
      author: "测试用户",
      articleId: 1,
    });
    console.log("评论创建成功:", response.data);
  } catch (error) {
    console.error("评论创建失败:");
    if (error.response) {
      console.error("响应状态:", error.response.status);
      console.error("响应数据:", error.response.data);
      console.error("响应头:", error.response.headers);
    } else if (error.request) {
      console.error("请求已发送但没有收到响应:", error.request);
    } else {
      console.error("请求设置时出错:", error.message);
    }
    console.error("错误配置:", error.config);
  }
}

testCommentCreation();

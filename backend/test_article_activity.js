const http = require("http");

// 创建测试文章
function createTestArticle(token) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      title: "测试文章",
      content: "这是一篇测试文章，用于验证活动日历功能",
      summary: "测试文章摘要",
      status: "published",
      categoryId: 1,
    });

    const options = {
      hostname: "localhost",
      port: 3005,
      path: "/api/articles",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          resolve({ statusCode: res.statusCode, response });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (error) => {
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
      hostname: "localhost",
      port: 3005,
      path: "/api/articles/activity",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          resolve({ statusCode: res.statusCode, response });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

// 运行测试
async function runTests() {
  try {
    console.log("=== 测试文章活动数据 ===\n");

    // 使用之前测试中创建的用户token
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwic3ViIjozLCJpYXQiOjE3Njg5ODA0ODMsImV4cCI6MTc2ODk4NzY4M30.BgbcdZ59y4HEAUh_8RU-Q3QUOALF94AZM2vcVVcI9uc";

    // 1. 创建测试文章
    console.log("1. 创建测试文章...");
    const createResult = await createTestArticle(token);
    console.log(`   状态码: ${createResult.statusCode}`);
    console.log(`   响应: ${JSON.stringify(createResult.response, null, 2)}`);
    console.log();

    // 2. 测试活动端点
    console.log("2. 测试活动端点...");
    const activityResult = await testActivityEndpoint(token);
    console.log(`   状态码: ${activityResult.statusCode}`);
    console.log(`   响应类型: ${typeof activityResult.response}`);
    console.log(`   响应数据类型: ${typeof activityResult.response.data}`);
    // 检查是否是嵌套响应格式
    const actualActivityData =
      activityResult.response.data.data || activityResult.response.data;
    console.log(`   实际活动数据类型: ${typeof actualActivityData}`);
    console.log(
      `   实际活动数据是否为数组: ${Array.isArray(actualActivityData)}`,
    );
    console.log(
      `   实际活动数据长度: ${actualActivityData ? actualActivityData.length : "undefined"}`,
    );
    // 只打印响应的前500个字符，避免输出过长
    console.log(
      `   响应前500字符: ${JSON.stringify(activityResult.response).substring(0, 500)}...`,
    );
    console.log();

    // 检查今天的日期是否有活动数据
    const today = new Date().toISOString().split("T")[0];
    console.log(`   今日日期: ${today}`);

    if (Array.isArray(actualActivityData)) {
      const todayActivity = actualActivityData.find(
        (item) => item.date === today,
      );
      console.log(`   今日活动数据: ${JSON.stringify(todayActivity, null, 2)}`);

      if (todayActivity && todayActivity.count > 0) {
        console.log("✅ 活动端点成功返回了新发布的文章数据！");
        console.log(`✅ 今日发布的文章数量: ${todayActivity.count}`);
      } else {
        console.log("❌ 活动端点未返回新发布的文章数据！");
      }
    } else {
      console.log("⚠️  活动数据不是数组格式");
    }

    console.log("\n=== 测试完成 ===");
  } catch (error) {
    console.error("测试过程中发生错误:", error);
  }
}

runTests();

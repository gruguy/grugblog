// 测试敏感词过滤功能
import { containsSensitiveWords, filterSensitiveWords } from './src/utils/sensitiveFilter.js';

// 测试用例
const testCases = [
  // 基础敏感词
  { text: '这是一个色情网站', expectedContains: true, expectedFiltered: '这是一个***网站' },
  { text: '这是一个黄色视频', expectedContains: true, expectedFiltered: '这是一个***视频' },
  { text: '这是一个正常的评论', expectedContains: false, expectedFiltered: '这是一个正常的评论' },
  
  // 变形词测试
  { text: '这是一个se情网站', expectedContains: true, expectedFiltered: '这是一个***网站' },
  { text: '这是一个sq网站', expectedContains: true, expectedFiltered: '这是一个***网站' },
  { text: '这是一个黄s网站', expectedContains: true, expectedFiltered: '这是一个***网站' },
  
  // 英文敏感词
  { text: 'This is a fuck comment', expectedContains: true, expectedFiltered: 'This is a **** comment' },
  { text: 'This is a normal comment', expectedContains: false, expectedFiltered: 'This is a normal comment' },
  
  // 多个敏感词
  { text: '这是一个色情视频和黄色网站', expectedContains: true, expectedFiltered: '这是一个***视频和***网站' },
  
  // 包含敏感词但不是完整匹配
  { text: '这是一个色情内容的讨论', expectedContains: true, expectedFiltered: '这是一个***内容的讨论' },
];

// 运行测试
let passed = 0;
let failed = 0;

console.log('开始测试敏感词过滤功能...\n');

testCases.forEach((testCase, index) => {
  const resultContains = containsSensitiveWords(testCase.text);
  const resultFiltered = filterSensitiveWords(testCase.text);
  
  const isContainsCorrect = resultContains === testCase.expectedContains;
  const isFilteredCorrect = resultFiltered === testCase.expectedFiltered;
  const isPassed = isContainsCorrect && isFilteredCorrect;
  
  if (isPassed) {
    passed++;
    console.log(`✅ 测试用例 ${index + 1} 通过`);
    console.log(`   输入: ${testCase.text}`);
    console.log(`   预期包含敏感词: ${testCase.expectedContains}`);
    console.log(`   实际包含敏感词: ${resultContains}`);
    console.log(`   预期过滤结果: ${testCase.expectedFiltered}`);
    console.log(`   实际过滤结果: ${resultFiltered}`);
  } else {
    failed++;
    console.log(`❌ 测试用例 ${index + 1} 失败`);
    console.log(`   输入: ${testCase.text}`);
    console.log(`   预期包含敏感词: ${testCase.expectedContains}`);
    console.log(`   实际包含敏感词: ${resultContains}`);
    console.log(`   预期过滤结果: ${testCase.expectedFiltered}`);
    console.log(`   实际过滤结果: ${resultFiltered}`);
  }
  console.log('');
});

console.log(`测试完成: ${passed} 个通过, ${failed} 个失败`);
console.log(`通过率: ${((passed / testCases.length) * 100).toFixed(2)}%`);

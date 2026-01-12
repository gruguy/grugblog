// 简化的敏感词过滤工具

// 基础敏感词列表
const baseSensitiveWords = [
  // 基础脏话和敏感词
  '操', '傻逼', '妈蛋', '滚蛋', '废物',
  '垃圾', '畜生', '杂种', '白痴', '脑残',
  '弱智', '二货', '妈的', '草泥马',
  'fuck', 'shit', 'bitch', 'asshole', 'damn',
  
  // 黄色和违禁词
  '色情', '黄色', '黄色网站', '黄色小说', '黄色视频',
  '色情网站', '色情小说', '色情视频', '成人网站', '成人内容',
  'AV', 'av', '黄片', '黄碟', '黄色图片',
  '色情图片', '性感', '裸露', '露点', '三级片',
  '性爱', '性行为', '做爱', '性交', '性关系',
  '阴茎', '龟头', '阴道', '乳房', '乳头',
  '自慰', '手淫', '嫖娼', '卖淫', '妓女',
  '嫖客', '红灯区', '性服务', '性交易', '性工作者',
  '春药', '伟哥', '催情', '色情直播', '直播做爱',
  '裸聊', '裸播', '色情主播', '黄色主播', '性暗示',
];

// 变形词映射
const variantMap: Record<string, string[]> = {
  '操': ['草', '艹', '肏', 'cào'],
  '傻逼': ['sb', '煞笔', '沙比', '傻屄'],
  'fuck': ['f*ck', 'f**k', 'fu*k', 'fk'],
  '色情': ['se情', 'sq', '色q'],
  '黄色': ['huangse', 'hs', '黄s'],
  '做爱': ['zuoai', 'za', '作爱'],
  'AV': ['A片', 'a片', '成人片'],
  '黄片': ['huangpian', 'hp', '黄pian'],
};

// 构建完整的敏感词列表，包括变形词
const buildSensitiveWordList = (): Set<string> => {
  const wordSet = new Set<string>();
  
  // 添加基础敏感词
  baseSensitiveWords.forEach(word => {
    wordSet.add(word);
    
    // 添加变形词
    if (variantMap[word]) {
      variantMap[word].forEach(variant => {
        wordSet.add(variant);
      });
    }
  });
  
  return wordSet;
};

// 构建敏感词列表
const sensitiveWordSet = buildSensitiveWordList();

/**
 * 检查文本中是否包含敏感词
 * @param text 要检查的文本
 * @returns 包含敏感词返回true，否则返回false
 */
export const containsSensitiveWords = (text: string): boolean => {
  if (!text) return false;
  
  // 遍历所有敏感词，检查是否包含
  for (const word of sensitiveWordSet) {
    if (text.includes(word)) {
      return true;
    }
  }
  
  return false;
};

/**
 * 过滤文本中的敏感词，替换为星号
 * @param text 要过滤的文本
 * @returns 过滤后的文本
 */
export const filterSensitiveWords = (text: string): string => {
  if (!text) return text;
  
  let filteredText = text;
  
  // 遍历所有敏感词，进行替换
  for (const word of sensitiveWordSet) {
    if (filteredText.includes(word)) {
      // 创建正则表达式，忽略大小写
      const regex = new RegExp(word, 'gi');
      // 替换为相同长度的星号
      filteredText = filteredText.replace(regex, '*'.repeat(word.length));
    }
  }
  
  return filteredText;
};

/**
 * 获取文本中包含的敏感词列表
 * @param text 要检查的文本
 * @returns 包含的敏感词列表
 */
export const getSensitiveWords = (text: string): string[] => {
  if (!text) return [];
  
  const foundWords: string[] = [];
  
  // 遍历所有敏感词，检查是否包含
  for (const word of sensitiveWordSet) {
    if (text.includes(word)) {
      foundWords.push(word);
    }
  }
  
  return foundWords;
};

/**
 * 敏感词过滤结果
 */
export interface SensitiveCheckResult {
  containsSensitive: boolean;
  foundWords: string[];
  filteredText: string;
}

/**
 * 全面检查和过滤文本中的敏感词
 * @param text 要检查和过滤的文本
 * @returns 敏感词检查和过滤结果
 */
export const checkAndFilterSensitiveWords = (text: string): SensitiveCheckResult => {
  const foundWords = getSensitiveWords(text);
  const filteredText = filterSensitiveWords(text);
  
  return {
    containsSensitive: foundWords.length > 0,
    foundWords,
    filteredText
  };
};

/**
 * 动态添加敏感词
 * @param word 要添加的敏感词
 */
export const addSensitiveWord = (word: string): void => {
  sensitiveWordSet.add(word);
};

/**
 * 批量添加敏感词
 * @param words 要添加的敏感词列表
 */
export const addSensitiveWords = (words: string[]): void => {
  words.forEach(word => sensitiveWordSet.add(word));
};

// 导出敏感词数量，方便调试
export const getSensitiveWordCount = (): number => {
  return sensitiveWordSet.size;
};

// 调试信息
console.log('敏感词过滤工具初始化完成，加载敏感词数量:', sensitiveWordSet.size);

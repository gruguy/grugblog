import badwords from "badwords";

// 创建完整的敏感词列表
const sensitiveWords = [
  ...badwords, // 导入默认敏感词列表
  "敏感词1",
  "敏感词2",
  "敏感词3",
  // 可以根据需要添加更多敏感词
];

// 创建正则表达式，用于匹配所有敏感词
const sensitiveRegex = new RegExp(
  sensitiveWords
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|"),
  "gi"
);

/**
 * 检查文本中是否包含敏感词
 * @param text 要检查的文本
 * @returns 包含敏感词返回true，否则返回false
 */
export const containsSensitiveWords = (text: string): boolean => {
  return sensitiveRegex.test(text);
};

/**
 * 过滤文本中的敏感词，替换为星号
 * @param text 要过滤的文本
 * @returns 过滤后的文本
 */
export const filterSensitiveWords = (text: string): string => {
  return text.replace(sensitiveRegex, "*");
};

/**
 * 获取文本中包含的敏感词列表
 * @param text 要检查的文本
 * @returns 包含的敏感词列表
 */
export const getSensitiveWords = (text: string): string[] => {
  const foundWords: string[] = [];

  for (const word of sensitiveWords) {
    const regex = new RegExp(word, "gi");
    if (regex.test(text)) {
      foundWords.push(word);
    }
  }

  return [...new Set(foundWords)]; // 去重
};

/**
 * 敏感词过滤结果
 */
export interface SensitiveCheckResult {
  containsSensitive: boolean;
  foundWords: string[];
  filteredText: string;
}

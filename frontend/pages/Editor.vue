<template>
  <div class="editor-container">
    <!-- 顶部工具栏 -->
    <div class="editor-header">
      <div class="title-container">
        <input
          type="text"
          v-model="title"
          placeholder="输入文章标题..."
          class="title-input"
        />
        <button
          class="ai-write-btn"
          @click="handleAiWrite"
          :disabled="generatingContent"
          title="AI帮我写"
        >
          <span v-if="generatingContent">生成中...</span>
          <span v-else>AI帮我写</span>
        </button>
      </div>
      <div class="category-selector">
        <select
          v-model="selectedCategory"
          class="category-dropdown"
          placeholder="选择文章分类..."
        >
          <option value="">未分类</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="header-actions">
        <span class="auto-save">文章将自动保存到草稿箱</span>
        <button
          class="draft-btn"
          @click="handleSaveDraft"
          :disabled="savingDraft"
        >
          <span v-if="savingDraft">保存中...</span>
          <span v-else>保存草稿</span>
        </button>
        <button
          class="publish-btn"
          @click="handlePublish"
          :disabled="publishing"
        >
          <span v-if="publishing">发表中...</span>
          <span v-else>发布</span>
        </button>
        <div class="user-avatar">
          <img
            v-if="userStore.user?.avatar"
            :src="userStore.user?.avatar"
            alt="头像"
          />
          <div v-else class="avatar-placeholder">
            {{ (userStore.user?.username || "U").charAt(0).toUpperCase() }}
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑器工具栏 -->
    <div class="editor-toolbar">
      <button class="toolbar-btn" title="加粗"><b>B</b></button>
      <button class="toolbar-btn" title="斜体"><i>I</i></button>
      <button class="toolbar-btn" title="下划线"><u>U</u></button>
      <button class="toolbar-btn" title="删除线"><s>S</s></button>
      <button class="toolbar-btn" title="引用"><q>"</q></button>
      <button class="toolbar-btn" title="图片">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </button>
      <button class="toolbar-btn" title="链接">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
          ></path>
          <path
            d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
          ></path>
        </svg>
      </button>
      <button class="toolbar-btn" title="列表">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
      <button class="toolbar-btn" title="有序列表">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="10" y1="6" x2="21" y2="6"></line>
          <line x1="10" y1="12" x2="21" y2="12"></line>
          <line x1="10" y1="18" x2="21" y2="18"></line>
          <path d="M4 6h1v4"></path>
          <path d="M4 10h2"></path>
          <path d="M6 16h1v2"></path>
          <path d="M4 16h2"></path>
          <path d="M4 12h2"></path>
        </svg>
      </button>
      <button class="toolbar-btn" title="代码块">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      </button>
      <button class="toolbar-btn" title="表格">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
      </button>
      <button class="toolbar-btn" title="水平线">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="4" y1="12" x2="20" y2="12"></line>
        </svg>
      </button>
      <button class="toolbar-btn" title="撤销">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="1 4 1 10 7 10"></polyline>
          <path
            d="M10.59 14.59A2 2 0 1 1 14 11h-2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2a2 2 0 0 0-1.41 0.59l-3 3z"
          ></path>
        </svg>
      </button>
      <button class="toolbar-btn" title="重做">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="23 4 23 10 17 10"></polyline>
          <path
            d="M9.59 14.59A2 2 0 1 0 13 11h2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4h2a2 2 0 0 1 1.41 0.59l3 3z"
          ></path>
        </svg>
      </button>
    </div>

    <!-- 编辑器主体 -->
    <div class="editor-main" ref="editorMain">
      <!-- 左侧编辑区 -->
      <div
        class="editor-input"
        ref="editorInput"
        contenteditable="true"
        @input="handleInput"
      ></div>
      <!-- 右侧预览区 -->
      <div class="editor-preview">
        <div v-html="previewContent"></div>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="editor-footer">
      <div class="stats">
        <span>字符数: {{ stats.characters }}</span>
        <span>行数: {{ stats.lines }}</span>
        <span>正文字数: {{ stats.words }}</span>
      </div>
      <div class="footer-actions">
        <label class="sync-scroll">
          <input type="checkbox" v-model="syncScroll" />
          <span>同步滚动</span>
        </label>
        <button class="back-top" @click="scrollToTop">回到顶部</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import { publishArticle, saveArticleDraft, getCategories } from "@/api/content";
import { message } from "@/utils/alertUtils";
import {
  containsSensitiveWords,
  filterSensitiveWords,
} from "@/utils/sensitiveFilter";
import { marked } from "marked";

const userStore = useUserStore();
const router = useRouter();

// 编辑器内容
const title = ref("");
const content = ref("");
const previewContent = ref("");
const editorInput = ref<HTMLElement | null>(null);
const editorMain = ref<HTMLElement | null>(null);

// 文章分类
const categories = ref<any[]>([]);
const selectedCategory = ref<number | undefined>(undefined);

// 滚动同步
const syncScroll = ref(true);

// 统计信息
const stats = ref({
  characters: 0,
  lines: 1,
  words: 0,
});

// 加载状态
const publishing = ref(false);
const savingDraft = ref(false);
const generatingContent = ref(false);

// 处理输入
const handleInput = () => {
  if (!editorInput.value) return;

  // 获取编辑区的文本内容作为原始markdown
  content.value = editorInput.value.innerText;
  updatePreview();
  updateStats();
};

// 更新预览
const updatePreview = async () => {
  // 使用marked将markdown转换为HTML
  previewContent.value = content.value ? await marked.parse(content.value) : "";
};

// 更新统计信息
const updateStats = () => {
  if (!editorInput.value) return;

  const text = editorInput.value.textContent || "";
  stats.value.characters = text.length;
  stats.value.lines = (text.match(/\n/g) || []).length + 1;
  stats.value.words = text.trim() ? text.trim().split(/\s+/).length : 0;
};

// 同步滚动
const handleScroll = (e: Event) => {
  if (!syncScroll.value || !editorMain.value) return;

  const target = e.target as HTMLElement;
  const other = target.classList.contains("editor-input")
    ? (editorMain.value.querySelector(".editor-preview") as HTMLElement)
    : (editorMain.value.querySelector(".editor-input") as HTMLElement);

  if (other) {
    other.scrollTop = target.scrollTop;
    other.scrollLeft = target.scrollLeft;
  }
};

// 回到顶部
const scrollToTop = () => {
  if (editorInput.value) {
    editorInput.value.scrollTop = 0;
  }
  if (editorMain.value?.querySelector(".editor-preview")) {
    (
      editorMain.value.querySelector(".editor-preview") as HTMLElement
    ).scrollTop = 0;
  }
};

// 保存草稿
const handleSaveDraft = async () => {
  if (!title.value.trim() && !content.value.trim()) {
    message.warning("请输入标题或内容后再保存草稿");
    return;
  }

  // 敏感词过滤检查
  const titleHasSensitive = containsSensitiveWords(title.value);
  const contentHasSensitive = containsSensitiveWords(content.value);

  let saveTitle = title.value;
  let saveContent = content.value;

  if (titleHasSensitive || contentHasSensitive) {
    // 过滤敏感词
    saveTitle = filterSensitiveWords(title.value);
    saveContent = filterSensitiveWords(content.value);

    // 提示用户
    const confirmSave = confirm(
      "您的文章中可能包含敏感词，已自动过滤。是否继续保存？"
    );
    if (!confirmSave) {
      return;
    }
  }

  savingDraft.value = true;
  try {
    await saveArticleDraft({
      title: saveTitle.trim() || "未命名草稿",
      content: saveContent,
      status: "draft",
      categoryId: selectedCategory.value,
    });
    message.success("草稿已保存");
  } catch (error: any) {
    console.error("保存草稿失败:", error);
    message.error(error.response?.data?.message || "保存草稿失败");
  } finally {
    savingDraft.value = false;
  }
};

// AI帮我写文章内容
const handleAiWrite = async () => {
  if (!title.value.trim()) {
    message.warning("请先输入文章标题");
    return;
  }

  generatingContent.value = true;
  try {
    // 获取AI接口地址
    const aiApiUrl =
      import.meta.env.VITE_AI_API_URL ||
      "http://61.171.115.123:11434/api/generate";

    // 清空编辑器内容
    content.value = "";
    if (editorInput.value) {
      editorInput.value.innerHTML = "";
      updatePreview();
      updateStats();
    }

    // 调用AI接口
    const response = await fetch(aiApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-r1:32b",
        prompt: `请帮我写一篇关于"${title.value}"的博客文章，内容要丰富，结构清晰，语言流畅。`,
        stream: true, // 使用流式输出
      }),
    });

    if (!response.ok) {
      throw new Error(`AI接口请求失败: ${response.status}`);
    }

    // 检查是否支持流式响应
    if (!response.body) {
      throw new Error("服务器不支持流式响应");
    }

    // 创建文本解码器
    const decoder = new TextDecoder("utf-8");
    // 获取可读流
    const reader = response.body.getReader();
    // 用于存储生成的内容
    let generatedContent = "";

    // 循环读取流数据
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      // 解码流数据
      const chunk = decoder.decode(value, { stream: true });
      // 分割JSON行
      const lines = chunk.split("\n");

      // 处理每一行JSON数据
      for (const line of lines) {
        if (line.trim()) {
          try {
            // 解析JSON数据
            const jsonData = JSON.parse(line.replace(/^data: /, ""));
            // 如果有响应内容，添加到生成的内容中
            if (jsonData.response) {
              generatedContent += jsonData.response;
              // 更新编辑器内容
              content.value = generatedContent;
              if (editorInput.value) {
                // 编辑区显示原始markdown文本
                editorInput.value.innerText = generatedContent;
                // 更新预览（会自动转换为HTML）
                updatePreview();
                updateStats();
              }
            }
          } catch (error) {
            console.error("解析JSON数据失败:", error);
          }
        }
      }
    }

    message.success("AI生成内容成功");
  } catch (error: any) {
    console.error("AI生成内容失败:", error);
    message.error("AI生成内容失败，请重试");
  } finally {
    generatingContent.value = false;
  }
};

// 发表文章
const handlePublish = async () => {
  if (!title.value.trim()) {
    message.warning("请输入文章标题");
    return;
  }
  if (!content.value.trim()) {
    message.warning("请输入文章内容");
    return;
  }

  // 敏感词过滤检查
  const titleHasSensitive = containsSensitiveWords(title.value);
  const contentHasSensitive = containsSensitiveWords(content.value);

  if (titleHasSensitive || contentHasSensitive) {
    // 过滤敏感词
    const filteredTitle = filterSensitiveWords(title.value);
    const filteredContent = filterSensitiveWords(content.value);

    // 提示用户
    const confirmPublish = confirm(
      "您的文章中可能包含敏感词，已自动过滤。是否继续发布？"
    );
    if (!confirmPublish) {
      return;
    }

    // 使用过滤后的内容发布
    content.value = filteredContent;
    title.value = filteredTitle;
  }

  publishing.value = true;
  try {
    const result = await publishArticle({
      title: title.value.trim(),
      content: content.value,
      status: "published",
      categoryId: selectedCategory.value,
    });
    message.success("文章已发表");
    // 发表成功后跳转到文章详情页
    router.push(`/article/${result.id}`);
  } catch (error: any) {
    console.error("发表文章失败:", error);
    message.error(error.response?.data?.message || "发表文章失败");
  } finally {
    publishing.value = false;
  }
};

// 获取分类列表
const fetchCategories = async () => {
  try {
    const data = await getCategories();
    categories.value = data;
  } catch (error) {
    console.error("获取分类列表失败:", error);
    message.error("获取分类列表失败");
  }
};

// 初始化编辑器
onMounted(async () => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    router.push("/");
    return;
  }

  // 获取分类列表
  await fetchCategories();

  // 设置编辑区焦点
  if (editorInput.value) {
    editorInput.value.focus();
  }

  // 监听滚动事件
  if (editorMain.value) {
    const input = editorMain.value.querySelector(".editor-input");
    const preview = editorMain.value.querySelector(".editor-preview");
    if (input) input.addEventListener("scroll", handleScroll);
    if (preview) preview.addEventListener("scroll", handleScroll);
  }

  // 自动保存
  const autoSave = setInterval(() => {
    if (content.value || title.value) {
      console.log("自动保存草稿:", {
        title: title.value,
        content: content.value,
      });
      // 这里可以添加保存到后端的逻辑
    }
  }, 30000); // 每30秒自动保存

  onUnmounted(() => {
    clearInterval(autoSave);
  });
});
</script>

<style scoped>
.editor-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
}

.title-container {
  flex: 1;
  display: flex;
  gap: 12px;
  align-items: center;
  margin-right: 24px;
}

.title-input {
  flex: 1;
  font-size: 24px;
  font-weight: bold;
  border: none;
  outline: none;
  padding: 8px 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.ai-write-btn {
  padding: 8px 16px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
}

.ai-write-btn:hover {
  background-color: #66b1ff;
}

.ai-write-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.category-selector {
  margin-right: 24px;
}

.category-dropdown {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.category-dropdown:hover {
  border-color: #1890ff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.auto-save {
  font-size: 12px;
  color: #666;
}

.draft-btn {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.publish-btn {
  padding: 8px 24px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
}

.editor-toolbar {
  display: flex;
  gap: 8px;
  padding: 12px 24px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  flex-wrap: wrap;
}

.toolbar-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background-color: #f0f0f0;
}

.editor-main {
  flex: 1;
  display: flex;
  overflow: hidden;
  background-color: white;
}

.editor-input,
.editor-preview {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  font-size: 16px;
  line-height: 1.6;
}

.editor-input {
  border-right: 1px solid #e0e0e0;
  outline: none;
}

.editor-preview {
  background-color: #fafafa;
}

/* 预览区样式 */
.editor-preview :deep(h1) {
  font-size: 28px;
  font-weight: bold;
  margin: 24px 0 16px;
  color: #2c3e50;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
}

.editor-preview :deep(h2) {
  font-size: 24px;
  font-weight: bold;
  margin: 20px 0 14px;
  color: #34495e;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 6px;
}

.editor-preview :deep(h3) {
  font-size: 20px;
  font-weight: bold;
  margin: 18px 0 12px;
  color: #34495e;
}

.editor-preview :deep(h4) {
  font-size: 18px;
  font-weight: bold;
  margin: 16px 0 10px;
  color: #34495e;
}

.editor-preview :deep(h5) {
  font-size: 16px;
  font-weight: bold;
  margin: 14px 0 8px;
  color: #34495e;
}

.editor-preview :deep(h6) {
  font-size: 14px;
  font-weight: bold;
  margin: 12px 0 6px;
  color: #34495e;
}

.editor-preview :deep(p) {
  margin: 12px 0;
  line-height: 1.6;
}

.editor-preview :deep(ul),
.editor-preview :deep(ol) {
  margin: 12px 0;
  padding-left: 24px;
}

.editor-preview :deep(li) {
  margin: 6px 0;
}

.editor-preview :deep(code) {
  background-color: #f0f0f0;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: "Courier New", Courier, monospace;
  font-size: 14px;
}

.editor-preview :deep(pre) {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 12px 0;
}

.editor-preview :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.editor-preview :deep(blockquote) {
  border-left: 4px solid #3498db;
  padding: 12px 16px;
  margin: 12px 0;
  background-color: #f8f9fa;
  color: #6c757d;
}

.editor-preview :deep(a) {
  color: #3498db;
  text-decoration: none;
}

.editor-preview :deep(a:hover) {
  text-decoration: underline;
}

.editor-preview :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 12px 0;
  border-radius: 4px;
}

.editor-preview :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 12px 0;
}

.editor-preview :deep(th),
.editor-preview :deep(td) {
  border: 1px solid #e0e0e0;
  padding: 8px 12px;
  text-align: left;
}

.editor-preview :deep(th) {
  background-color: #f5f5f5;
  font-weight: bold;
  color: #2c3e50;
}

.editor-preview :deep(tr:nth-child(even)) {
  background-color: #fafafa;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  font-size: 12px;
  color: #666;
}

.stats {
  display: flex;
  gap: 24px;
}

.footer-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.sync-scroll {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.back-top {
  padding: 4px 8px;
  border: 1px solid #e0e0e0;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

/* 滚动条样式 */
.editor-input::-webkit-scrollbar,
.editor-preview::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.editor-input::-webkit-scrollbar-track,
.editor-preview::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.editor-input::-webkit-scrollbar-thumb,
.editor-preview::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.editor-input::-webkit-scrollbar-thumb:hover,
.editor-preview::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

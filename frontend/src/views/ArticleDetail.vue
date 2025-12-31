<template>
  <MainLayout>
    <div v-if="contentStore.articleLoading" class="text-center py-12">
      <p class="text-muted-foreground">加载中...</p>
    </div>
    <article v-else-if="contentStore.currentArticle" class="max-w-4xl mx-auto">
      <header class="mb-8">
        <h1 class="text-4xl font-bold mb-2">
          {{
            contentStore.currentArticle.title ||
            `文章 ${contentStore.currentArticle.id}`
          }}
        </h1>
        <!-- 文章摘要 -->
        <p class="text-lg text-muted-foreground mb-4 max-w-3xl">
          {{
            contentStore.currentArticle.summary ||
            contentStore.currentArticle.content
              .replace(/<[^>]+>/g, "")
              .substring(0, 50) +
              (contentStore.currentArticle.content.replace(/<[^>]+>/g, "")
                .length > 50
                ? "..."
                : "")
          }}
        </p>
        <div class="flex items-center space-x-4 text-muted-foreground">
          <span>{{ formatDate(contentStore.currentArticle.createdAt) }}</span>
          <span>{{ contentStore.currentArticle.views }} 阅读</span>
          <span
            v-if="contentStore.currentArticle.category"
            :class="[
              'px-2 py-0.5 rounded text-xs',
              getCategoryTagClass(contentStore.currentArticle.category.id),
            ]"
          >
            {{ contentStore.currentArticle.category.name }}
          </span>
        </div>
      </header>

      <div
        v-if="contentStore.currentArticle.cover"
        class="mb-8 rounded-lg overflow-hidden"
      >
        <img
          :src="contentStore.currentArticle.cover"
          :alt="contentStore.currentArticle.title"
          class="w-full h-auto"
        />
      </div>

      <!-- 左侧固定功能按钮组 -->
      <div
        class="fixed left-[calc(50%-32rem-20px)] top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-4 z-10"
      >
        <!-- 点赞功能 -->
        <button
          @click="toggleLike"
          class="flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors flat-button"
          title="点赞"
        >
          <svg
            :class="[
              'w-5 h-5',
              liked ? 'text-red-500' : 'text-muted-foreground',
            ]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
          <span class="text-xs mt-1">{{
            contentStore.currentArticle.likes || 0
          }}</span>
        </button>

        <!-- 收藏功能 -->
        <button
          @click="toggleCollect"
          class="flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors flat-button"
          title="收藏"
        >
          <svg
            :class="[
              'w-5 h-5',
              collected ? 'text-yellow-500' : 'text-muted-foreground',
            ]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
          <span class="text-xs mt-1">{{ collected ? "已收藏" : "收藏" }}</span>
        </button>

        <!-- 分享功能 -->
        <button
          @click="shareArticle"
          class="flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors flat-button"
          title="分享"
        >
          <svg
            class="w-5 h-5 text-muted-foreground"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
            />
          </svg>
          <span class="text-xs mt-1">分享</span>
        </button>

        <!-- 举报功能 -->
        <button
          @click="reportArticle"
          class="flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors flat-button"
          title="举报"
        >
          <svg
            class="w-5 h-5 text-muted-foreground"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
          <span class="text-xs mt-1">举报</span>
        </button>
      </div>

      <!-- 文章主体区域 -->
      <div class="mb-8">
        <!-- 文章内容 -->
        <div class="prose prose-lg max-w-none" v-html="renderedContent"></div>
      </div>

      <!-- 评论区 -->
      <div class="mb-8">
        <h3 class="text-2xl font-bold mb-4">评论 ({{ comments.length }})</h3>

        <!-- 评论列表 -->
        <div class="space-y-4 mb-6">
          <!-- 评论项 -->
          <Comment
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            :on-reply="startReply"
            @like="handleCommentLike"
          />

          <!-- 占位评论 -->
          <div
            v-if="comments.length === 0"
            class="text-center py-8 text-muted-foreground"
          >
            暂无评论，快来抢沙发吧！
          </div>
        </div>

        <!-- 发表评论 -->
        <div class="bg-card p-4 rounded-lg border border-border">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium">
              {{ replyToCommentId ? `回复 @${replyToAuthor}` : "发表评论" }}
            </h4>
            <button
              v-if="replyToCommentId"
              @click="cancelReply"
              class="text-sm text-muted-foreground hover:text-foreground"
            >
              取消回复
            </button>
          </div>
          <div class="relative mb-3">
            <!-- 评论输入框 -->
            <textarea
              ref="commentTextarea"
              v-model="commentContent"
              placeholder="请输入评论内容..."
              class="w-full p-3 border border-border rounded-lg"
              rows="3"
            ></textarea>
            <!-- 表情按钮 -->
            <div class="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                @click="toggleEmojiPicker"
                class="text-muted-foreground hover:text-foreground"
                title="表情"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.43 9.57c-.14.14-.33.21-.53.21-.2 0-.39-.07-.53-.21l-1.41-1.41-1.41 1.41c-.14.14-.33.21-.53.21-.2 0-.39-.07-.53-.21-.28-.28-.28-.73 0-1.01l1.41-1.41-1.41-1.41c-.28-.28-.28-.73 0-1.01s.73-.28 1.01 0l1.41 1.41 1.41-1.41c.28-.28.73-.28 1.01 0 .28.28.28.73 0 1.01l-1.41 1.41 1.41 1.41c.28.28.28.73 0 1.01zM9 13h2v2H9zm3-6h-2v2h2zm-6 0H5v2h1zm0 4H5v2h1zm0 4H5v2h1z"
                  ></path>
                </svg>
              </button>
            </div>
            <!-- 表情选择器 -->
            <div
              v-if="showEmojiPicker"
              class="absolute bottom-full right-0 mb-2 bg-card rounded-lg border border-border shadow-lg p-2 grid grid-cols-8 gap-2 w-64 max-h-60 overflow-y-auto"
            >
              <button
                v-for="emoji in emojis"
                :key="emoji"
                @click="insertEmoji(emoji)"
                class="text-xl p-1 rounded hover:bg-muted transition-colors"
                title="插入表情"
              >
                {{ emoji }}
              </button>
            </div>
          </div>
          <div class="flex justify-end">
            <button
              @click="submitComment"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              :disabled="!commentContent.trim()"
            >
              {{ replyToCommentId ? "回复" : "发表评论" }}
            </button>
          </div>
        </div>
      </div>
    </article>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { marked } from "marked";
import MainLayout from "@/layouts/MainLayout.vue";
import { useContentStore } from "@/stores/contentStore";
import { useUserStore } from "@/stores/userStore";
import dayjs from "dayjs";
import Comment from "@/components/Comment.vue";
// 引入API
import {
  toggleArticleLike,
  checkArticleLikeStatus,
  toggleArticleCollect,
  checkArticleCollectStatus,
  getArticleComments,
  createArticleComment,
  toggleCommentLike,
} from "@/api/content";
// 引入敏感词过滤工具
import {
  containsSensitiveWords,
  filterSensitiveWords,
} from "@/utils/sensitiveFilter";

const route = useRoute();
const contentStore = useContentStore();
const userStore = useUserStore();

// 状态管理
const renderedContent = computed(() => {
  if (!contentStore.currentArticle) return "";
  return marked(contentStore.currentArticle.content);
});

// 点赞状态
const liked = ref(false);

// 收藏状态
const collected = ref(false);

// 评论相关
const comments = ref<any[]>([]);
const commentContent = ref("");
const replyToCommentId = ref<number | null>(null);
const replyToAuthor = ref("");
const commentTextarea = ref<HTMLTextAreaElement | null>(null);
const showEmojiPicker = ref(false);

// 常用表情列表
const emojis = ref([
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🤩",
  "🥳",
  "😏",
  "😒",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  "☹️",
  "😣",
  "😖",
  "😫",
  "😩",
  "🥺",
  "😢",
  "😭",
  "😤",
  "😠",
  "😡",
  "🤬",
  "🤯",
  "😳",
  "🥵",
  "🥶",
  "😱",
  "😨",
  "😰",
  "😥",
  "😓",
  "🤗",
  "🤔",
  "🤭",
  "🤫",
  "🤥",
  "😶",
  "😐",
  "😑",
  "😬",
  "🙄",
  "😯",
  "😦",
  "😧",
  "😮",
  "😲",
  "🥱",
  "😴",
  "🤤",
  "😪",
  "😵",
  "🤐",
  "🥴",
  "🤢",
  "🤮",
  "🤧",
  "😷",
  "🤒",
  "🤕",
  "🤑",
  "🤠",
  "😈",
  "👿",
  "👹",
  "👺",
  "🤡",
  "💩",
  "👻",
]);

// 格式化日期为相对时间
const formatDate = (date: string) => {
  const now = dayjs(date);
  return now.format("YYYY年MM月DD日");
};

// 根据类别ID获取标签样式
const getCategoryTagClass = (categoryId: number) => {
  // 定义类别颜色映射
  const categoryColors: Record<number, string> = {
    1: "bg-blue-100 text-blue-700",
    2: "bg-green-100 text-green-700",
    3: "bg-purple-100 text-purple-700",
    4: "bg-pink-100 text-pink-700",
    5: "bg-yellow-100 text-yellow-700",
    6: "bg-orange-100 text-orange-700",
    7: "bg-teal-100 text-teal-700",
    8: "bg-red-100 text-red-700",
  };

  // 如果没有匹配的颜色，使用默认颜色
  return categoryColors[categoryId] || "bg-primary/10 text-primary";
};

// 开始回复
const startReply = (comment: any) => {
  replyToCommentId.value = comment.id;
  replyToAuthor.value = comment.author;
  commentContent.value = `@${comment.author} `;
  // 跳转到评论框并获得焦点
  setTimeout(() => {
    commentTextarea.value?.focus();
  }, 100);
};

// 取消回复
const cancelReply = () => {
  replyToCommentId.value = null;
  replyToAuthor.value = "";
  commentContent.value = "";
};

// 切换表情选择器
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

// 插入表情
const insertEmoji = (emoji: string) => {
  if (commentTextarea.value) {
    // 获取当前光标位置
    const start = commentTextarea.value.selectionStart;
    const end = commentTextarea.value.selectionEnd;
    const text = commentTextarea.value.value;

    // 插入表情
    commentContent.value = text.slice(0, start) + emoji + text.slice(end);

    // 关闭表情选择器
    showEmojiPicker.value = false;

    // 恢复焦点并设置光标位置
    setTimeout(() => {
      commentTextarea.value?.focus();
      if (commentTextarea.value) {
        commentTextarea.value.selectionStart =
          commentTextarea.value.selectionEnd = start + emoji.length;
      }
    }, 100);
  } else {
    // 如果没有textarea引用，直接添加到内容末尾
    commentContent.value += emoji;
    showEmojiPicker.value = false;
  }
};

// 点赞功能
const toggleLike = async () => {
  try {
    const articleId = parseInt(route.params.id as string);
    console.log("Calling toggleArticleLike with articleId:", articleId);
    const response = await toggleArticleLike(articleId);
    console.log("toggleArticleLike response:", response);
    // 后端直接返回点赞状态，而不是包装在data字段中
    if (response && response.isLiked !== undefined) {
      liked.value = response.isLiked;
    }
    if (
      contentStore.currentArticle &&
      response &&
      response.likes !== undefined
    ) {
      contentStore.currentArticle.likes = response.likes;
    }
  } catch (error) {
    console.error("点赞失败:", error);
  }
};

// 收藏功能
const toggleCollect = async () => {
  try {
    const articleId = parseInt(route.params.id as string);
    console.log("Calling toggleArticleCollect with articleId:", articleId);
    const response = await toggleArticleCollect(articleId);
    console.log("toggleArticleCollect response:", response);
    // 后端直接返回收藏状态，而不是包装在data字段中
    if (response && response.isCollected !== undefined) {
      collected.value = response.isCollected;
    }
  } catch (error) {
    console.error("收藏失败:", error);
  }
};

// 分享功能
const shareArticle = () => {
  // 实现分享功能
  if (navigator.share) {
    navigator.share({
      title: contentStore.currentArticle?.title,
      text: contentStore.currentArticle?.summary,
      url: window.location.href,
    });
  } else {
    // 复制链接到剪贴板
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert("链接已复制到剪贴板");
      })
      .catch((err) => {
        console.error("复制链接失败:", err);
      });
  }
  console.log("share article");
};

// 举报功能
const reportArticle = () => {
  // 实现举报功能
  if (confirm("确定要举报这篇文章吗？")) {
    // TODO: 调用API实现举报功能
    console.log("report article");
    alert("举报成功");
  }
};

// 处理评论点赞
const handleCommentLike = async (commentId: number) => {
  try {
    // 调用后端API切换点赞状态
    const response = await toggleCommentLike(commentId);

    // 递归查找并更新评论
    const updateCommentLike = (commentList: any[]) => {
      for (const comment of commentList) {
        if (comment.id === commentId) {
          // 更新点赞状态和数量
          comment.liked = response.liked;
          comment.likes = response.likes;
          return true;
        }
        if (comment.replies && updateCommentLike(comment.replies)) {
          return true;
        }
      }
      return false;
    };

    updateCommentLike(comments.value);
  } catch (error) {
    console.error("评论点赞失败:", error);
  }
};

// 提交评论
const submitComment = async () => {
  if (!commentContent.value.trim()) return;

  const articleId = parseInt(route.params.id as string);
  let commentText = commentContent.value.trim();

  // 敏感词过滤检查
  if (containsSensitiveWords(commentText)) {
    const filteredText = filterSensitiveWords(commentText);
    const confirmSubmit = confirm(
      "您的评论中可能包含敏感词，已自动过滤。是否继续提交？"
    );
    if (!confirmSubmit) {
      return;
    }
    commentText = filteredText;
  }

  try {
    // 添加调试信息，查看提交的评论数据
    console.log("提交评论数据:", {
      content: commentText,
      author:
        userStore.user?.nickname || userStore.user?.username || "匿名用户",
      articleId,
      parentId: replyToCommentId.value,
      avatar: userStore.user?.avatar,
    });

    // 调用API提交评论
    const response = await createArticleComment({
      content: commentText,
      author:
        userStore.user?.nickname || userStore.user?.username || "匿名用户",
      articleId,
      parentId: replyToCommentId.value,
      avatar: userStore.user?.avatar,
    });

    console.log("评论提交响应:", response);

    // 添加到评论列表或回复列表
    if (replyToCommentId.value) {
      // 是回复，需要找到父评论并添加到其replies中
      const addReplyToParent = (commentList: any[]) => {
        for (const comment of commentList) {
          if (comment.id === replyToCommentId.value) {
            if (!comment.replies) {
              comment.replies = [];
            }
            // 后端直接返回评论数据，而不是包装在data字段中
            comment.replies.push(response);
            return true;
          }
          if (comment.replies && addReplyToParent(comment.replies)) {
            return true;
          }
        }
        return false;
      };

      addReplyToParent(comments.value);
    } else {
      // 是新评论，直接添加到评论列表
      // 后端直接返回评论数据，而不是包装在data字段中
      comments.value.unshift(response);
    }

    // 重置评论表单
    cancelReply();
  } catch (error) {
    console.error("提交评论失败:", error);
  }
};

onMounted(async () => {
  const articleId = parseInt(route.params.id as string);
  if (articleId) {
    await contentStore.fetchArticleById(articleId);

    // 检查点赞和收藏状态
    try {
      console.log("Calling checkArticleLikeStatus with articleId:", articleId);
      const likeStatus = await checkArticleLikeStatus(articleId);
      console.log("checkArticleLikeStatus response:", likeStatus);
      // 后端直接返回点赞状态，而不是包装在data字段中
      if (likeStatus && likeStatus.isLiked !== undefined) {
        liked.value = likeStatus.isLiked;
      }

      console.log(
        "Calling checkArticleCollectStatus with articleId:",
        articleId
      );
      const collectStatus = await checkArticleCollectStatus(articleId);
      console.log("checkArticleCollectStatus response:", collectStatus);
      // 后端直接返回收藏状态，而不是包装在data字段中
      if (collectStatus && collectStatus.isCollected !== undefined) {
        collected.value = collectStatus.isCollected;
      }
    } catch (error) {
      console.error("检查点赞收藏状态失败:", error);
    }

    // 调用API获取评论列表
    try {
      const response = await getArticleComments(articleId);
      // 后端直接返回评论数据，而不是包装在data字段中
      comments.value = response || [];
    } catch (error) {
      console.error("获取评论列表失败:", error);
      comments.value = [];
    }
  }
});
</script>

<style scoped>
/* 自定义文章内容样式 */
.prose {
  color: var(--text-foreground);
  line-height: 1.8;
}

.prose :deep(h1) {
  font-size: 28px;
  font-weight: bold;
  margin: 24px 0 16px;
  color: var(--text-foreground);
  border-bottom: 2px solid var(--border);
  padding-bottom: 8px;
}

.prose :deep(h2) {
  font-size: 24px;
  font-weight: bold;
  margin: 20px 0 14px;
  color: var(--text-foreground);
  border-bottom: 1px solid var(--border);
  padding-bottom: 6px;
}

.prose :deep(h3) {
  font-size: 20px;
  font-weight: bold;
  margin: 18px 0 12px;
  color: var(--text-foreground);
}

.prose :deep(h4) {
  font-size: 18px;
  font-weight: bold;
  margin: 16px 0 10px;
  color: var(--text-foreground);
}

.prose :deep(h5) {
  font-size: 16px;
  font-weight: bold;
  margin: 14px 0 8px;
  color: var(--text-foreground);
}

.prose :deep(h6) {
  font-size: 14px;
  font-weight: bold;
  margin: 12px 0 6px;
  color: var(--text-foreground);
}

.prose :deep(p) {
  margin: 12px 0;
  line-height: 1.8;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin: 12px 0;
  padding-left: 24px;
}

.prose :deep(li) {
  margin: 6px 0;
}

.prose :deep(code) {
  background-color: var(--muted);
  color: var(--text-foreground);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: "Courier New", Courier, monospace;
  font-size: 14px;
}

.prose :deep(pre) {
  background-color: var(--card);
  border: 1px solid var(--border);
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 12px 0;
}

.prose :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.prose :deep(blockquote) {
  border-left: 4px solid var(--primary);
  padding: 12px 16px;
  margin: 12px 0;
  background-color: var(--muted);
  color: var(--text-foreground);
}

.prose :deep(a) {
  color: var(--primary);
  text-decoration: none;
}

.prose :deep(a:hover) {
  text-decoration: underline;
}

.prose :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 12px 0;
  border-radius: 4px;
}

.prose :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 12px 0;
}

.prose :deep(th),
.prose :deep(td) {
  border: 1px solid var(--border);
  padding: 8px 12px;
  text-align: left;
}

.prose :deep(th) {
  background-color: var(--muted);
  font-weight: bold;
  color: var(--text-foreground);
}

.prose :deep(tr:nth-child(even)) {
  background-color: var(--muted);
}

/* 平滑过渡动画 */
.flat-button {
  transition: all 0.2s ease;
}

.flat-button:active {
  transform: scale(0.95);
}
</style>

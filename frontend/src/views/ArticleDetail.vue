<template>
  <MainLayout>
    <div v-if="contentStore.articleLoading" class="text-center py-12">
      <p class="text-muted-foreground">加载中...</p>
    </div>
    <article v-else-if="contentStore.currentArticle" class="max-w-4xl mx-auto">
      <!-- 右侧锚链接 -->
      <MarkdownAnchor :html-content="renderedContent" />

      <!-- 左侧固定功能按钮组 -->
      <div
        class="fixed left-[calc(50%-32rem-20px)] top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-4 z-10"
      >
        <!-- 点赞功能 -->
        <div class="flex flex-col items-center space-y-1">
          <Badge
            variant="default"
            :color="liked ? 'red' : 'default'"
            position="top-right"
          >
            <template #content>
              <Button
                variant="circle"
                color="white"
                shadow
                @click="toggleLike"
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
              </Button>
            </template>
            {{ contentStore.currentArticle.likes || 0 }}
          </Badge>
        </div>

        <!-- 收藏功能 -->
        <div class="flex flex-col items-center space-y-1">
          <Badge
            variant="default"
            :color="collected ? 'yellow' : 'default'"
            position="top-right"
          >
            <template #content>
              <Button
                variant="circle"
                color="white"
                shadow
                @click="toggleCollect"
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
              </Button>
            </template>
            {{ contentStore.currentArticle.collects || 0 }}
          </Badge>
        </div>

        <!-- 分享功能 -->
        <div class="flex flex-col items-center space-y-1">
          <Button
            variant="circle"
            color="white"
            shadow
            @click="shareArticle"
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
          </Button>
        </div>

        <!-- 举报功能 -->
        <div class="flex flex-col items-center space-y-1">
          <Button
            variant="circle"
            color="white"
            shadow
            @click="reportArticle"
            title="举报"
          >
            <svg
              class="w-5 h-5 text-muted-foreground"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
          </Button>
        </div>
      </div>

      <!-- 文章内容容器，包含白色背景 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <header class="mb-6">
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
          class="mb-6 rounded-lg overflow-hidden"
        >
          <img
            :src="contentStore.currentArticle.cover"
            :alt="contentStore.currentArticle.title"
            class="w-full h-auto"
          />
        </div>

        <!-- 文章主体区域 -->
        <div class="prose prose-lg max-w-none" v-html="renderedContent"></div>
      </div>

      <!-- 评论区 -->
      <div class="mb-8 bg-white p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold">评论 ({{ comments.length }})</h3>
          <div class="comment-sort flex">
            <button
              @click="sortType = 'hot'"
              :class="{ active: sortType === 'hot' }"
              class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-l-md transition-colors"
            >
              最热
            </button>
            <button
              @click="sortType = 'new'"
              :class="{ active: sortType === 'new' }"
              class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-r-md border-l border-gray-300 transition-colors"
            >
              最新
            </button>
          </div>
        </div>

        <!-- 发表评论表单 -->
        <Comment
          ref="commentFormRef"
          :is-comment-form="true"
          :user-info="userInfo"
          :on-submit="handleCommentSubmit"
        />

        <!-- 评论列表 -->
        <div class="mb-6">
          <!-- 评论项 -->
          <Comment
            v-for="comment in sortedComments"
            :key="comment.id"
            :comment="comment"
            :on-reply="handleCommentReply"
            :on-like="handleCommentLike"
            :user-info="userInfo"
          />

          <!-- 占位评论 -->
          <div
            v-if="sortedComments.length === 0"
            class="text-center py-8 text-muted-foreground bg-white p-4 rounded-lg"
          >
            暂无评论，快来抢沙发吧！
          </div>
        </div>
      </div>
    </article>
  </MainLayout>
</template>

<style scoped>
.comment-sort button.active {
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
}

.comment-sort button {
  transition: all 0.2s ease;
}
</style>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { marked } from "marked";
import MainLayout from "@/layouts/MainLayout.vue";
import { useContentStore } from "@/stores/contentStore";
import { useUserStore } from "@/stores/userStore";
import { useModalStore } from "@/stores/modalStore";
import dayjs from "dayjs";
import Comment from "@/components/Comment.vue";
import MarkdownAnchor from "@/components/MarkdownAnchor.vue";
import Button from "@/components/Button.vue";
import Badge from "@/components/Badge.vue";
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
const modalStore = useModalStore();

// Comment sorting state
const sortType = ref<"hot" | "new">("hot");

// Calculate total likes for a comment (including replies recursively)
const calculateTotalLikes = (comment: any): number => {
  let total = comment.likes || 0;
  if (comment.replies && comment.replies.length > 0) {
    comment.replies.forEach((reply: any) => {
      total += calculateTotalLikes(reply);
    });
  }
  return total;
};

// Sort comments by hot or new
const sortedComments = computed(() => {
  if (!comments.value.length) return [];

  const commentsCopy = [...comments.value];

  if (sortType.value === "hot") {
    // Sort by total likes (including replies) descending
    return commentsCopy.sort((a, b) => {
      const totalLikesA = calculateTotalLikes(a);
      const totalLikesB = calculateTotalLikes(b);
      return totalLikesB - totalLikesA;
    });
  } else {
    // Sort by createdAt descending (newest first)
    return commentsCopy.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
});

// 状态管理
const rawRenderedContent = computed(() => {
  if (!contentStore.currentArticle) return "";
  return marked(contentStore.currentArticle.content) as string;
});

const renderedContent = computed(() => {
  // 为标题添加ID，用于锚链接跳转
  const content = rawRenderedContent.value;
  if (typeof content !== "string") return "";

  // 使用简单的递增计数器确保绝对唯一
  let globalIdCounter = 0;

  return content.replace(
    /<h([1-6])[^>]*>(.*?)<\/h\1>/g,
    (_match: string, level: string, content: string) => {
      const text = content.replace(/<[^>]+>/g, "").trim();
      const baseId = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      // 递增计数器
      globalIdCounter++;

      // 始终返回带有计数器的ID，确保绝对唯一
      const id = `${baseId}-${globalIdCounter}`;

      return `<h${level} id="${id}">${content}</h${level}>`;
    }
  );
});

// 点赞状态
const liked = ref(false);

// 收藏状态
const collected = ref(false);

// 评论相关
const comments = ref<any[]>([]);

// 评论表单引用
const commentFormRef = ref<InstanceType<typeof Comment> | null>(null);

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

// 点赞功能
const toggleLike = async () => {
  // 检查用户是否登录
  if (!userStore.isLoggedIn) {
    modalStore.openLoginModal();
    return;
  }

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
  // 检查用户是否登录
  if (!userStore.isLoggedIn) {
    modalStore.openLoginModal();
    return;
  }

  try {
    const articleId = parseInt(route.params.id as string);
    console.log("Calling toggleArticleCollect with articleId:", articleId);
    const response = await toggleArticleCollect(articleId);
    console.log("toggleArticleCollect response:", response);
    // 后端直接返回收藏状态，而不是包装在data字段中
    if (response && response.isCollected !== undefined) {
      collected.value = response.isCollected;
    }
    // 更新收藏数量
    if (
      response &&
      response.collects !== undefined &&
      contentStore.currentArticle
    ) {
      contentStore.currentArticle.collects = response.collects;
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

// 用户信息，用于传递给Comment组件
const userInfo = computed(() => ({
  nickname: userStore.user?.nickname || userStore.user?.username || "匿名用户",
  username: userStore.user?.username,
  avatar: userStore.user?.avatar,
  id: userStore.user?.id,
}));

// 处理评论点赞
const handleCommentLike = async (commentId: number) => {
  // 检查用户是否登录
  if (!userStore.isLoggedIn) {
    modalStore.openLoginModal();
    return;
  }

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

// 处理评论回复
const handleCommentReply = (comment: any) => {
  // 使用ref直接调用Comment组件的startReply方法
  if (commentFormRef.value) {
    commentFormRef.value.startReply(comment);
  }
};

// 处理评论提交
const handleCommentSubmit = async (data: {
  content: string;
  parentId?: number;
}) => {
  const articleId = parseInt(route.params.id as string);
  let commentText = data.content;

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
      author: userInfo.value.nickname,
      articleId,
      parentId: data.parentId,
      avatar: userInfo.value.avatar,
    });

    // 调用API提交评论
    const response = await createArticleComment({
      content: commentText,
      author: userInfo.value.nickname,
      articleId,
      parentId: data.parentId,
      avatar: userInfo.value.avatar,
    });

    console.log("评论提交响应:", response);

    // 添加到评论列表或回复列表
    if (data.parentId) {
      // 是回复，需要找到父评论并添加到其replies中
      const addReplyToParent = (commentList: any[]) => {
        for (const comment of commentList) {
          if (comment.id === data.parentId) {
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

      // 发表回复后跳转至回复的具体地方
      setTimeout(() => {
        const parentCommentElement = document.getElementById(
          `comment-${data.parentId}`
        );
        if (parentCommentElement) {
          parentCommentElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start",
          });
        }
      }, 100);
    } else {
      // 是新评论，直接添加到评论列表
      // 后端直接返回评论数据，而不是包装在data字段中
      comments.value.unshift(response);
    }
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
  font-size: 24px;
  font-weight: bold;
  margin: 24px 0 16px;
  color: var(--text-foreground);
  border-bottom: 2px solid var(--border);
  padding-bottom: 8px;
}

.prose :deep(h2) {
  font-size: 22px;
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

/* 左侧固定功能按钮组样式 */
.fixed.left-\[calc\(50%\-32rem\-20px\)\].top-1\/2.transform.-translate-y-1\/2.flex.flex-col.items-center.space-y-4.z-10
  > button {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 8px;
  transition: all 0.2s ease;
}

/* 平滑过渡动画 */
.flat-button {
  transition: all 0.2s ease;
}

.flat-button:active {
  transform: scale(0.95);
}
</style>

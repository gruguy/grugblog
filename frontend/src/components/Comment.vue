<template>
  <div class="bg-muted rounded-lg p-4 mb-4">
    <div class="flex items-start gap-3">
      <!-- 评论头像 -->
      <div
        v-if="!comment.avatar"
        class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium text-xs border border-border"
      >
        {{ comment.author.charAt(0).toUpperCase() }}
      </div>
      <img
        v-else
        :src="comment.avatar"
        alt="头像"
        class="w-8 h-8 rounded-full object-cover border border-border"
      />
      <!-- 评论内容 -->
      <div class="flex-1">
        <!-- 作者 -->
        <div class="flex items-center gap-2 mb-1">
          <span class="font-medium text-sm">{{ comment.author }}</span>
        </div>
        <!-- 评论内容 -->
        <p class="text-sm mb-2">{{ comment.content }}</p>
        <!-- 操作按钮 -->
        <div class="flex items-center space-x-4">
          <!-- 时间 -->
          <span class="text-xs text-muted-foreground">{{
            formatDate(comment.createdAt)
          }}</span>
          <button
            @click="onReplyClick"
            class="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="m21 11-6-6m0 0V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v7m12 0h-2.586a1 1 0 0 1-.707-.293l-3.586-3.586a1 1 0 0 0-.707-.293h-3.586v2m-4 4 6 6m0 0V18a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v7m-12 0h2.586a1 1 0 0 0 .707-.293l3.586-3.586a1 1 0 0 1 .707-.293h3.586v-2"
              />
            </svg>
            回复
          </button>
          <button
            @click="onLikeClick"
            class="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            :class="{ 'text-primary': comment.liked }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
            <span>{{ comment.likes }}</span>
            <span>点赞</span>
          </button>
        </div>
        <!-- 回复列表 -->
        <div
          v-if="comment.replies && comment.replies.length > 0"
          class="mt-4 pl-4 border-l border-border space-y-4"
        >
          <Comment
            v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply"
            :on-reply="onReply"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// 扩展dayjs功能
interface CommentProps {
  comment: {
    id: number;
    content: string;
    author: string;
    avatar?: string;
    createdAt: string;
    likes: number;
    liked: boolean;
    replies?: any[];
  };
  onReply?: (comment: any) => void;
}

const emit = defineEmits(["reply"]);

dayjs.extend(relativeTime);

// 格式化日期为相对时间
const formatDate = (date: string) => {
  if (!date) return "";
  const now = dayjs();
  const target = dayjs(date);
  const diffMinutes = now.diff(target, "minute");
  const yesterday = now.subtract(1, "day");
  const isYesterday = target.isSame(yesterday, "day");
  const diffDays = now.diff(target, "day");
  const diffMonths = now.diff(target, "month");
  const diffYears = now.diff(target, "year");

  // 小于1分钟显示"刚刚"
  if (diffMinutes < 1) {
    return "刚刚";
  }

  // 小于1小时显示"XX分钟前"
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  }

  // 当天显示时间（上午）
  if (now.isSame(target, "day")) {
    const hour = target.hour();
    const minute = target.minute().toString().padStart(2, "0");
    return `上午 ${hour}:${minute}`;
  }

  // 昨天18点以后显示"昨晚"
  if (isYesterday && target.hour() >= 18) {
    return "昨晚";
  }

  // 昨天18点以前显示"1天前"
  if (isYesterday && target.hour() < 18) {
    return "1天前";
  }

  // 2-29天前显示"X天前"
  if (diffDays > 1 && diffDays < 30) {
    return `${diffDays}天前`;
  }

  // 1-11个月前显示"X个月前"
  if (diffMonths > 0 && diffMonths < 12) {
    return `${diffMonths}个月前`;
  }

  // 1年及以上显示"X年前"
  if (diffYears > 0) {
    return `${diffYears}年前`;
  }

  // 默认返回完整日期（应对极端情况）
  return target.format("YYYY-MM-DD HH:mm");
};

const props = defineProps<CommentProps>();
// 处理回复点击事件
const onReplyClick = () => {
  if (props.onReply) {
    props.onReply(props.comment);
  } else {
    emit("reply", props.comment);
  }
};

// 处理点赞点击事件
const onLikeClick = () => {
  // 这里需要调用后端API来处理点赞逻辑
  // 暂时使用模拟数据更新点赞状态和数量
  const comment = props.comment;
  comment.liked = !comment.liked;
  comment.likes += comment.liked ? 1 : -1;
};
</script>

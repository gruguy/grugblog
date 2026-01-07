<template>
  <!-- 评论展示 -->
  <div v-if="!isCommentForm" :id="`comment-${comment.id}`" class="bg-white rounded-lg py-1 mb-4">
    <div class="flex items-start gap-3">
      <!-- 评论头像 -->
      <div
        v-if="!comment.user?.avatar && !comment.avatar"
        class="rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium border border-border"
        :class="isReply ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-xs'"
      >
        {{ comment.author.charAt(0).toUpperCase() }}
      </div>
      <img
        v-else
        :src="comment.user?.avatar || comment.avatar"
        alt="头像"
        class="rounded-full object-cover border border-border"
        :class="isReply ? 'w-8 h-8' : 'w-10 h-10'"
      />
      <!-- 评论内容 -->
      <div class="flex-1">
        <!-- 作者 -->
        <div class="flex items-center gap-2 mb-1">
          <span class="font-medium text-sm text-muted-foreground">{{
            comment.author
          }}</span>
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
          class="mt-2 space-y-2"
        >
          <Comment
            v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply"
            :on-reply="props.onReply"
            :user-info="userInfo"
          />
        </div>
      </div>
    </div>
  </div>
  <!-- 发表评论 -->
  <div class="bg-white rounded-lg p-4 mb-4 comment-form-component" v-if="isCommentForm">
    <div class="flex items-start gap-3">
      <!-- 用户头像 -->
      <div
        v-if="!userInfo.avatar"
        class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium text-xs border border-border"
      >
        {{ (userInfo.nickname || userInfo.username || 'U').charAt(0).toUpperCase() }}
      </div>
      <img
        v-else
        :src="userInfo.avatar"
        alt="头像"
        class="w-10 h-10 rounded-full object-cover border border-border"
      />
      <!-- 评论输入框 -->
      <div class="flex-1">
        <div class="relative mb-3 border border-[#f2f3f5] bg-[#f2f3f5] rounded-lg overflow-hidden transition-all duration-300 focus-within:border-blue-500 focus-within:bg-white">
          <!-- 评论输入框 -->
          <textarea
            ref="commentTextarea"
            v-model="commentContent"
            placeholder="请输入评论内容..."
            class="w-full p-3 rounded-lg transition-all duration-300 focus:outline-none"
            style="height: 72px; resize: none; background: transparent;"
            @focus="handleFocus"
            @blur="handleBlur"
            maxlength="100"
          ></textarea>
          <!-- 字数统计 -->
          <div class="absolute bottom-2 left-3 text-xs text-muted-foreground">
            {{ commentContent.length }}/100
          </div>
          <!-- 表情按钮和发表按钮 -->
          <div class="absolute bottom-2 right-2 flex items-center gap-2">
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
            <button
              @click="submitComment"
              class="px-4 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
              :disabled="!commentContent.trim() || commentContent.length > 100"
            >
              {{ isReplyForm ? '回复' : '发表评论' }}
            </button>
          </div>
          <!-- 表情选择器 -->
          <div
            v-if="showEmojiPicker"
            class="absolute bottom-full right-0 mb-2 bg-card rounded-lg border border-border shadow-lg p-2 grid grid-cols-8 gap-2 w-64 max-h-60 overflow-y-auto z-20"
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
        <!-- 操作按钮 -->
        <div class="flex justify-end gap-2" v-if="isReplyForm">
          <button
            @click="cancelReply"
            class="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            取消回复
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// 扩展dayjs功能
interface CommentProps {
  // 评论数据
  comment?: {
    id: number;
    content: string;
    author: string;
    avatar?: string;
    user?: {
      avatar?: string;
    };
    createdAt: string;
    likes: number;
    liked: boolean;
    replies?: any[];
  };
  // 回复回调
  onReply?: (comment: any) => void;
  // 点赞回调
  onLike?: (commentId: number) => void;
  // 用户信息
  userInfo?: {
    nickname?: string;
    username?: string;
    avatar?: string;
    id?: number;
  };
  // 是否为评论表单
  isCommentForm?: boolean;
  // 提交评论回调
  onSubmit?: (data: {
    content: string;
    parentId?: number;
  }) => void;
}

// 常用表情列表
const emojis = ref([
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
  "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
  "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
  "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
  "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬",
  "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗",
  "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯",
  "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐",
  "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈",
  "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾"
]);

const props = withDefaults(defineProps<CommentProps>(), {
  isCommentForm: false,
  userInfo: () => ({}),
  comment: () => ({
    id: 0,
    content: '',
    author: '',
    createdAt: '',
    likes: 0,
    liked: false,
    replies: [],
    user: {}
  }),
  onLike: () => {},
  onSubmit: () => {}
});

dayjs.extend(relativeTime);

// 状态管理
const commentContent = ref("");
const showEmojiPicker = ref(false);
const isReplyForm = ref(false);
const replyToCommentId = ref<number | null>(null);
const replyToAuthor = ref("");
const commentTextarea = ref<HTMLTextAreaElement | null>(null);

// 计算属性
// isReply用于判断当前评论是否是回复评论（子评论）
const isReply = computed(() => {
  // 检查props.onReply是否存在，或者检查评论是否有parentId（如果API返回的话）
  // 这里我们保持原有的逻辑，因为在当前实现中，只有回复评论才会被传递onReply回调
  return !!props.onReply;
});

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

// 处理回复点击事件
const onReplyClick = () => {
  if (props.onReply) {
    props.onReply(props.comment);
  }
};

// 处理点赞点击事件
const onLikeClick = () => {
  props.onLike(props.comment.id);
};

// 处理评论输入框获得焦点
const handleFocus = (event: FocusEvent) => {
  const target = event.target as HTMLTextAreaElement;
  target.style.height = "120px";
};

// 处理评论输入框失去焦点
const handleBlur = (event: FocusEvent) => {
  const target = event.target as HTMLTextAreaElement;
  if (!commentContent.value.trim()) {
    target.style.height = "72px";
  }
};

// 切换表情选择器
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

// 插入表情
const insertEmoji = (emoji: string) => {
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
  if (textarea) {
    // 获取当前光标位置
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    // 插入表情
    commentContent.value = text.slice(0, start) + emoji + text.slice(end);

    // 关闭表情选择器
    showEmojiPicker.value = false;

    // 恢复焦点并设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    }, 100);
  } else {
    // 如果没有textarea引用，直接添加到内容末尾
    commentContent.value += emoji;
    showEmojiPicker.value = false;
  }
};

// 提交评论
const submitComment = () => {
  if (!commentContent.value.trim()) return;
  
  props.onSubmit({
    content: commentContent.value.trim(),
    parentId: replyToCommentId.value || undefined
  });
  
  // 重置表单
  resetForm();
};

// 开始回复
const startReply = (comment: any) => {
  isReplyForm.value = true;
  replyToCommentId.value = comment.id;
  replyToAuthor.value = comment.author;
  commentContent.value = `@${comment.author} `;
  
  // 等待DOM更新后自动focus输入框
  setTimeout(() => {
    if (commentTextarea.value) {
      commentTextarea.value.focus();
      // 将光标移动到文本末尾
      const textLength = commentContent.value.length;
      commentTextarea.value.setSelectionRange(textLength, textLength);
      // 应用焦点样式
      commentTextarea.value.style.height = "120px";
    }
  }, 50);
};

// 取消回复
const cancelReply = () => {
  resetForm();
};

// 重置表单
const resetForm = () => {
  commentContent.value = "";
  showEmojiPicker.value = false;
  isReplyForm.value = false;
  replyToCommentId.value = null;
  replyToAuthor.value = "";
  
  // 恢复输入框高度
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
  if (textarea) {
    textarea.style.height = "72px";
  }
};

// 暴露方法给父组件
defineExpose({
  startReply,
  cancelReply
});
</script>
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
        <!-- 作者和时间 -->
        <div class="flex items-center justify-between mb-1">
          <span class="font-medium text-sm">{{ comment.author }}</span>
          <span class="text-xs text-muted-foreground">{{ formatDate(comment.createdAt) }}</span>
        </div>
        <!-- 评论内容 -->
        <p class="text-sm mb-2">{{ comment.content }}</p>
        <!-- 操作按钮 -->
        <div class="flex items-center space-x-4">
          <button class="text-xs text-muted-foreground hover:text-primary transition-colors">
            回复
          </button>
        </div>
        <!-- 回复列表 -->
        <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 pl-4 border-l border-border space-y-4">
          <Comment
            v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import dayjs from 'dayjs'

interface CommentProps {
  comment: {
    id: number
    content: string
    author: string
    avatar?: string
    createdAt: string
    replies?: any[]
  }
}

defineProps<CommentProps>()

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}
</script>

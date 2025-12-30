<template>
  <RouterLink
    :to="`/article/${article.id}`"
    class="block bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-border relative"
  >
    <!-- 推荐角标 -->
    <div
      v-if="isFeatured"
      class="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-2 py-1 rounded-bl-md"
    >
      推荐
    </div>
    <div v-if="article.cover" class="aspect-video overflow-hidden">
      <img
        :src="article.cover"
        :alt="article.title"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div class="p-6">
      <h3 class="text-xl font-bold mb-2 text-foreground line-clamp-2">
        {{ article.title }}
      </h3>
      <p v-if="article.summary" class="text-muted-foreground mb-4 line-clamp-3">
        {{ article.summary }}
      </p>
      <div
        class="flex items-center justify-between text-sm text-muted-foreground"
      >
        <div class="flex items-center space-x-4">
          <span>{{ formatDate(article.createdAt) }}</span>
          <span class="flex items-center gap-1">
            <svg
              class="w-4 h-4 text-muted-foreground"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
              />
            </svg>
            {{ article.views }} 阅读
          </span>
        </div>
        <span
          v-if="article.category"
          :class="[
            'px-2 py-1 rounded',
            getCategoryTagClass(article.category.id),
          ]"
        >
          {{ article.category.name }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import dayjs from "dayjs";
import type { Article } from "@/types/content";

const props = defineProps<{
  article: Article;
  isFeatured?: boolean;
}>();

const isFeatured = computed(() => props.isFeatured || false);

const formatDate = (date: string) => {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
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
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

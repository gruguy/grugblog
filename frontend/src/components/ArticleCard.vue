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
          <span>{{ article.views }} 阅读</span>
        </div>
        <span
          v-if="article.category"
          class="px-2 py-1 bg-primary/10 text-primary rounded"
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

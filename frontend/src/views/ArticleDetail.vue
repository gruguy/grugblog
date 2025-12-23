<template>
  <MainLayout>
    <div v-if="contentStore.articleLoading" class="text-center py-12">
      <p class="text-muted-foreground">加载中...</p>
    </div>
    <article v-else-if="contentStore.currentArticle" class="max-w-4xl mx-auto">
      <header class="mb-8">
        <h1 class="text-4xl font-bold mb-4">{{ contentStore.currentArticle.title }}</h1>
        <div class="flex items-center space-x-4 text-muted-foreground">
          <span>{{ formatDate(contentStore.currentArticle.createdAt) }}</span>
          <span>{{ contentStore.currentArticle.views }} 阅读</span>
          <span v-if="contentStore.currentArticle.category">
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

      <div
        class="prose prose-lg max-w-none"
        v-html="renderedContent"
      ></div>
    </article>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import MainLayout from '@/layouts/MainLayout.vue'
import { useContentStore } from '@/stores/contentStore'
import dayjs from 'dayjs'

const route = useRoute()
const contentStore = useContentStore()

const renderedContent = computed(() => {
  if (!contentStore.currentArticle) return ''
  return marked(contentStore.currentArticle.content)
})

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY年MM月DD日 HH:mm:ss')
}

onMounted(async () => {
  const articleId = parseInt(route.params.id as string)
  if (articleId) {
    await contentStore.fetchArticleById(articleId)
  }
})
</script>

<style scoped>
.prose {
  @apply text-foreground;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4),
.prose :deep(h5),
.prose :deep(h6) {
  @apply text-foreground font-bold mt-8 mb-4;
}

.prose :deep(p) {
  @apply mb-4 leading-7;
}

.prose :deep(code) {
  @apply bg-muted px-2 py-1 rounded text-sm;
}

.prose :deep(pre) {
  @apply bg-muted p-4 rounded-lg overflow-x-auto mb-4;
}

.prose :deep(pre code) {
  @apply bg-transparent p-0;
}

.prose :deep(blockquote) {
  @apply border-l-4 border-primary pl-4 italic my-4;
}

.prose :deep(ul),
.prose :deep(ol) {
  @apply mb-4 pl-6;
}

.prose :deep(li) {
  @apply mb-2;
}

.prose :deep(a) {
  @apply text-primary hover:underline;
}

.prose :deep(img) {
  @apply rounded-lg my-4;
}
</style>


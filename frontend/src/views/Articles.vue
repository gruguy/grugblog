<template>
  <MainLayout>
    <div class="space-y-6">
      <h1 class="text-3xl font-bold">文章列表</h1>

      <!-- 筛选栏 -->
      <div
        class="flex flex-wrap items-center gap-4 bg-card p-4 rounded-lg border border-border"
      >
        <select
          v-model="selectedCategory"
          @change="handleFilter"
          class="px-4 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="">全部分类</option>
          <option
            v-for="cat in contentStore.categories"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- 文章列表容器 -->
      <div
        ref="articleListContainer"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[calc(100vh-180px)] overflow-y-auto p-1"
        @scroll="handleScroll"
      >
        <!-- 空数据状态 -->
        <div
          v-if="
            !contentStore.articleLoading && contentStore.articles.length === 0
          "
          class="col-span-full text-center py-12"
        >
          <p class="text-muted-foreground">暂无文章</p>
        </div>

        <!-- 骨架屏加载状态 - 初始加载 -->
        <div
          v-else-if="
            contentStore.articleLoading && contentStore.articles.length === 0
          "
          class="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div v-for="i in 6" :key="`skeleton-${i}`" class="space-y-6">
            <Skeleton type="article-card" />
          </div>
        </div>

        <!-- 文章列表 -->
        <template v-else>
          <ArticleCard
            v-for="article in contentStore.articles"
            :key="article.id"
            :article="article"
          />

          <!-- 加载更多骨架屏 -->
          <div
            v-if="contentStore.isLoadingMore"
            class="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div v-for="i in 3" :key="`load-more-skeleton-${i}`">
              <Skeleton type="article-card" />
            </div>
          </div>

          <!-- 没有更多数据 -->
          <div
            v-else-if="
              !contentStore.hasMore && contentStore.articles.length > 0
            "
            class="col-span-full text-center py-4 text-muted-foreground"
          >
            没有更多文章了
          </div>
        </template>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import MainLayout from "@/layouts/MainLayout.vue";
import ArticleCard from "@/components/ArticleCard.vue";
import Skeleton from "@/components/Skeleton.vue";
import { useContentStore } from "@/stores/contentStore";

const contentStore = useContentStore();
const selectedCategory = ref<number | "">("");

// 文章列表容器引用，用于监听滚动事件
const articleListContainer = ref<HTMLElement | null>(null);

// 滚动到底部加载更多的处理函数
const handleScroll = () => {
  if (
    !articleListContainer.value ||
    contentStore.isLoadingMore ||
    !contentStore.hasMore
  ) {
    return;
  }

  const { scrollTop, scrollHeight, clientHeight } = articleListContainer.value;

  // 当滚动到距离底部100px时，加载更多数据
  if (scrollHeight - scrollTop - clientHeight < 100) {
    contentStore.loadMoreArticles();
  }
};

const handleFilter = async () => {
  // 重置文章列表和当前分类ID
  contentStore.articles = [];
  contentStore.currentCategoryId = selectedCategory.value || null;
  contentStore.hasMore = true;
  contentStore.currentPage = 1;
  await fetchArticles();
};

const fetchArticles = async () => {
  try {
    await contentStore.fetchArticles({
      page: 1,
      size: 12,
      categoryId: selectedCategory.value || undefined,
      append: false,
    });
  } catch (error) {
    console.error("获取文章列表失败:", error);
  }
};

onMounted(async () => {
  await Promise.all([fetchArticles(), contentStore.fetchCategories()]);
});
</script>

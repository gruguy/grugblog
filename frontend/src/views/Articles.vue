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

      <!-- 文章列表 -->
      <div v-if="contentStore.articleLoading" class="text-center py-12">
        <p class="text-muted-foreground">加载中...</p>
      </div>
      <div
        v-else-if="contentStore.articles.length === 0"
        class="text-center py-12"
      >
        <p class="text-muted-foreground">暂无文章</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ArticleCard
          v-for="article in contentStore.articles"
          :key="article.id"
          :article="article"
        />
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex justify-center space-x-2">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          class="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors"
          :class="{ 'bg-primary text-white': currentPage === page }"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import MainLayout from "@/layouts/MainLayout.vue";
import ArticleCard from "@/components/ArticleCard.vue";
import { useContentStore } from "@/stores/contentStore";

const contentStore = useContentStore();
const selectedCategory = ref<number | "">("");
const currentPage = ref(1);
const pageSize = ref(12);
const totalPages = ref(1);

const handleFilter = async () => {
  currentPage.value = 1;
  await fetchArticles();
};

const goToPage = async (page: number) => {
  currentPage.value = page;
  await fetchArticles();
};

const fetchArticles = async () => {
  try {
    const response = await contentStore.fetchArticles({
      page: currentPage.value,
      size: pageSize.value,
      categoryId: selectedCategory.value || undefined,
    });
    if (response) {
      totalPages.value = Math.ceil(response.total / pageSize.value);
    }
  } catch (error) {
    console.error("获取文章列表失败:", error);
  }
};

onMounted(async () => {
  await Promise.all([fetchArticles(), contentStore.fetchCategories()]);
});
</script>

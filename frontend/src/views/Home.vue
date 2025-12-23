<template>
  <MainLayout>
    <!-- 轮播图 -->
    <section class="relative h-96 rounded-lg overflow-hidden mb-12">
      <div
        class="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-80"
      ></div>
      <div class="relative h-full flex items-center justify-center text-white">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-4">欢迎来到我的博客</h1>
          <p class="text-xl md:text-2xl">分享生活，记录成长</p>
        </div>
      </div>
    </section>

    <!-- 活动日历 -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-6">我的活动日历</h2>
      <ActivityCalendar
        :data="activityStore.activityData"
        :show-legend="true"
        :show-month="true"
        :show-week="true"
        @click="handleDateClick"
      />
    </section>

    <!-- 三栏布局 -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- 左侧：文章分类 -->
      <aside class="lg:col-span-2 bg-card border border-border">
        <div class="p-4">
          <h3 class="font-bold text-lg mb-4">文章分类</h3>
          <ul class="space-y-1">
            <li
              @click="selectCategory(null)"
              :class="[
                'block px-4 py-2 cursor-pointer transition-colors flex justify-between items-center',
                selectedCategoryId === null
                  ? 'bg-primary text-white font-medium'
                  : 'hover:bg-muted',
              ]"
            >
              <span>全部文章</span>
              <span class="text-xs text-muted-foreground">{{
                totalArticlesCount
              }}</span>
            </li>
            <li
              v-for="category in categoriesWithCount"
              :key="category.id"
              @click="selectCategory(category.id)"
              :class="[
                'block px-4 py-2 cursor-pointer transition-colors flex justify-between items-center',
                selectedCategoryId === category.id
                  ? 'bg-primary text-white font-medium'
                  : 'hover:bg-muted',
              ]"
            >
              <span>{{ category.name }}</span>
              <span class="text-xs text-muted-foreground">{{
                category.articleCount
              }}</span>
            </li>
          </ul>
        </div>
      </aside>

      <!-- 中间：文章列表 -->
      <main class="lg:col-span-7">
        <!-- 文章列表 -->
        <div class="space-y-6">
          <div
            v-for="article in articles"
            :key="article.id"
            class="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div class="p-4 md:p-6">
              <div class="flex flex-col md:flex-row gap-4">
                <!-- 文章封面 -->
                <div
                  v-if="article.cover"
                  class="md:w-1/4 h-32 md:h-40 overflow-hidden rounded-md"
                >
                  <img
                    :src="article.cover"
                    :alt="article.title"
                    class="w-full h-full object-cover"
                  />
                </div>
                <!-- 文章内容 -->
                <div class="flex-1">
                  <h3
                    class="text-xl font-bold mb-2 hover:text-primary transition-colors"
                  >
                    {{ article.title }}
                  </h3>
                  <p class="text-muted-foreground mb-4 line-clamp-2">
                    {{ article.summary }}
                  </p>
                  <div
                    class="flex items-center justify-between text-sm text-muted-foreground"
                  >
                    <div class="flex items-center space-x-4">
                      <span>{{ article.author || "匿名" }}</span>
                      <span>👁️ {{ article.views }} 阅读</span>
                      <span>❤️ {{ article.likes || 0 }} 点赞</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span
                        v-if="article.category"
                        class="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs"
                      >
                        {{ article.category.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- 右侧：文章榜 + 作者榜 -->
      <aside class="lg:col-span-3 space-y-6">
        <!-- 用户信息 -->
        <div class="bg-card rounded-lg border border-border p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-lg">下午好！</h3>
            <button
              class="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90 transition-colors"
            >
              去签到
            </button>
          </div>
          <p class="text-sm text-muted-foreground">点亮社区的每一天</p>
        </div>

        <!-- 文章榜 -->
        <div class="bg-card rounded-lg border border-border p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-lg">文章榜</h3>
            <button class="text-sm text-primary hover:underline">换一换</button>
          </div>
          <ul class="space-y-3">
            <li
              v-for="(article, index) in recommendedArticles"
              :key="article.id"
              class="flex items-start gap-3"
            >
              <span class="text-lg font-bold text-muted-foreground">{{
                index + 1
              }}</span>
              <div class="flex-1">
                <h4
                  class="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                >
                  {{ article.title }}
                </h4>
              </div>
            </li>
          </ul>
        </div>

        <!-- 作者榜 -->
        <div class="bg-card rounded-lg border border-border p-4">
          <h3 class="font-bold text-lg mb-4">作者榜</h3>
          <ul class="space-y-3">
            <li
              v-for="(author, index) in topAuthors"
              :key="author.id"
              class="flex items-center gap-3"
            >
              <div
                class="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold"
              >
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">{{ author.name }}</span>
                  <button class="text-xs text-primary hover:underline">
                    + 关注
                  </button>
                </div>
                <p class="text-xs text-muted-foreground">
                  {{ author.specialty }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import MainLayout from "@/layouts/MainLayout.vue";
import ArticleCard from "@/components/ArticleCard.vue";
import ActivityCalendar from "@/components/ActivityCalendar.vue";
import { useContentStore } from "@/stores/contentStore";
import { useActivityStore } from "@/stores/activityStore";
import type { Article } from "@/types/content";
import type { ActivityData } from "@/types/activity";

const contentStore = useContentStore();
const activityStore = useActivityStore();

// 分类选择
const selectedCategoryId = ref<number | null>(null);

// 计算属性：最新动态（使用实际文章数据）
const recentUpdates = computed(() => {
  // 从文章中生成最新动态，只显示最近5条
  return [...contentStore.articles]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)
    .map((article, index) => ({
      id: index + 1,
      content: `发布了新文章《${article.title}》`,
      time: new Date(article.createdAt).toLocaleString(),
    }));
});

// 计算属性：推荐文章（浏览量最高的前3篇）
const recommendedArticles = computed(() => {
  return [...contentStore.articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);
});

// 计算属性：当前分类的文章
const articles = computed(() => {
  return contentStore.articles;
});

// 计算属性：总文章数量
const totalArticlesCount = computed(() => {
  return contentStore.articles.length;
});

// 计算属性：带文章数量的分类列表
const categoriesWithCount = computed(() => {
  // 获取所有文章
  const allArticles = contentStore.articles;
  // 创建分类ID到文章数量的映射
  const categoryCountMap = new Map<number, number>();

  // 统计每个分类的文章数量
  allArticles.forEach((article) => {
    if (article.categoryId) {
      const currentCount = categoryCountMap.get(article.categoryId) || 0;
      categoryCountMap.set(article.categoryId, currentCount + 1);
    }
  });

  // 为每个分类添加文章数量
  return contentStore.categories.map((category) => ({
    ...category,
    articleCount: categoryCountMap.get(category.id) || 0,
  }));
});

// 计算属性：作者榜数据（模拟）
const topAuthors = computed(() => {
  return [
    { id: 1, name: "CodeSheep", specialty: "前端 · 后端 · 程序员" },
    { id: 2, name: "JavaGuide", specialty: "后端 · Java" },
    { id: 3, name: "alamhubb", specialty: "前端 · 前端框架" },
    { id: 4, name: "最会吃的虎", specialty: "后端 · MySQL" },
    { id: 5, name: "ErpanOmer", specialty: "前端 · Vue.js" },
  ];
});

// 选择分类
const selectCategory = (categoryId: number | null) => {
  selectedCategoryId.value = categoryId;
  fetchArticlesByCategory();
};

// 根据分类获取文章
const fetchArticlesByCategory = async () => {
  try {
    await contentStore.fetchArticles({
      page: 1,
      size: 10,
      categoryId: selectedCategoryId.value || undefined,
    });
  } catch (error) {
    console.error("获取文章失败:", error);
  }
};

onMounted(async () => {
  try {
    // 获取文章分类
    await contentStore.fetchCategories();

    // 获取所有文章
    await contentStore.fetchArticles({ page: 1, size: 10 });

    // 获取活动数据
    await activityStore.fetchActivityData();
  } catch (error) {
    console.error("获取数据失败:", error);
  }
});

// 处理日期点击事件
const handleDateClick = (date: string, data: ActivityData | undefined) => {
  console.log("点击了日期:", date, data);
};
</script>

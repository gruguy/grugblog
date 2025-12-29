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
      <!-- <h2 class="text-2xl font-bold mb-6">我的活动日历</h2> -->
      <GitHubStyleCalendar
        :data="activityStore.activityData"
        :title="'我的活动日历'"
        :show-legend="true"
        @click="handleDateClick"
        @yearChange="handleYearChange"
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
      <main
        class="lg:col-span-7 h-screen lg:h-[calc(100vh-250px)] overflow-hidden"
      >
        <!-- 文章列表 -->
        <div class="space-y-6 overflow-y-auto max-h-full p-1">
          <div
            v-for="(article, index) in articles"
            :key="article.id"
            class="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow relative"
          >
            <!-- 置顶标签 -->
            <div
              v-if="index < 3"
              class="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full"
            >
              置顶
            </div>
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
                    <router-link
                      :to="`/article/${article.id}`"
                      class="hover:text-primary transition-colors"
                    >
                      {{ article.title || `文章 ${article.id}` }}
                    </router-link>
                  </h3>
                  <p class="text-muted-foreground mb-4 line-clamp-2">
                    {{
                      article.summary ||
                      article.content.replace(/<[^>]+>/g, "").substring(0, 50) +
                        (article.content.replace(/<[^>]+>/g, "").length > 50
                          ? "..."
                          : "")
                    }}
                  </p>
                  <div
                    class="flex items-center justify-between text-sm text-muted-foreground"
                  >
                    <div class="flex items-center space-x-4">
                      <span>{{ article.author || "匿名" }}</span>
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
                      <span class="flex items-center gap-1">
                        <svg
                          class="w-4 h-4 text-muted-foreground"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          />
                        </svg>
                        {{ article.likes || 0 }} 点赞
                      </span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span
                        v-if="article.category"
                        :class="[
                          'px-2 py-0.5 rounded text-xs',
                          getCategoryTagClass(article.category.id),
                        ]"
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
            <h3 class="font-bold text-lg">热门文章</h3>
            <button class="text-sm text-primary hover:underline" @click="refreshArticles">换一换</button>
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
                  <router-link
                    :to="`/article/${article.id}`"
                    class="hover:text-primary transition-colors"
                  >
                    {{ article.title || `文章 ${article.id}` }}
                  </router-link>
                </h4>
                <div class="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <svg
                    class="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                  <span>{{ article.likes || 0 }}</span>
                </div>
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
                  <span class="text-sm font-medium">{{ author.nickname || author.username }}</span>
                  <button 
                    class="text-xs hover:underline"
                    :class="followStatus[author.id] ? 'text-primary' : 'text-primary'"
                    @click="handleFollow(author.id)"
                  >
                    {{ followStatus[author.id] ? '已关注' : '+ 关注' }}
                  </button>
                </div>
                <p class="text-xs text-muted-foreground">
                  发布了 {{ author.articleCount }} 篇文章
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
import GitHubStyleCalendar from "@/components/GitHubStyleCalendar.vue";
import { useContentStore } from "@/stores/contentStore";
import { useActivityStore } from "@/stores/activityStore";
import { useUserStore } from "@/stores/userStore";
import type { Article } from "@/types/content";
import type { ActivityData } from "@/types/activity";
import { getAuthorRanking, followUser, unfollowUser, checkFollowStatus } from "@/api/content";

const contentStore = useContentStore();
const activityStore = useActivityStore();
const userStore = useUserStore();

// 分类选择
const selectedCategoryId = ref<number | null>(null);

// 作者榜数据
const topAuthors = ref<any[]>([]);
// 关注状态
const followStatus = ref<Record<number, boolean>>({});

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
      content: `发布了新文章《${article.title || `文章 ${article.id}`}》`,
      time: new Date(article.createdAt).toLocaleString(),
    }));
});

// 计算属性：推荐文章（点赞量最高的前3篇）
const recommendedArticles = computed(() => {
  return [...contentStore.articles]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 3);
});

// 计算属性：当前分类的文章，先按时间排序，再按阅读量和点赞量的和排序
const articles = computed(() => {
  return [...contentStore.articles].sort((a, b) => {
    // 首先按创建时间降序排序
    const timeDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (timeDiff !== 0) {
      return timeDiff;
    }
    // 时间相同则按阅读量+点赞量的和降序排序
    const totalA = (a.views || 0) + (a.likes || 0);
    const totalB = (b.views || 0) + (b.likes || 0);
    return totalB - totalA;
  });
});

// 计算属性：总文章数量（使用独立的变量来存储，避免切换分类时变化）
const totalArticlesCount = ref(0);

// 计算属性：带文章数量的分类列表（直接使用后端返回的数据）
const categoriesWithCount = computed(() => {
  return contentStore.categories;
});

// 获取作者榜数据
const fetchAuthorRanking = async () => {
  try {
    const data = await getAuthorRanking();
    topAuthors.value = data;
    
    // 检查关注状态（独立try-catch，避免影响作者榜数据显示）
    if (userStore.isLoggedIn) {
      for (const author of data) {
        try {
          const status = await checkFollowStatus(author.id);
          followStatus.value[author.id] = status.isFollowing;
        } catch (error) {
          console.error(`检查关注状态失败（作者ID: ${author.id}）:`, error);
          // 关注状态检查失败，不影响作者榜数据显示
          followStatus.value[author.id] = false;
        }
      }
    }
  } catch (error) {
    console.error("获取作者榜失败:", error);
    // 使用空数组作为备选，避免显示默认的模拟数据
    topAuthors.value = [];
  }
};

// 处理关注/取消关注
const handleFollow = async (authorId: number) => {
  try {
    if (!userStore.isLoggedIn) {
      // 如果未登录，跳转到登录页
      window.location.href = '/login';
      return;
    }
    
    if (followStatus.value[authorId]) {
      // 取消关注
      await unfollowUser(authorId);
      followStatus.value[authorId] = false;
    } else {
      // 关注
      await followUser(authorId);
      followStatus.value[authorId] = true;
    }
  } catch (error) {
    console.error("操作失败:", error);
  }
};

onMounted(async () => {
  try {
    // 获取文章分类
    await contentStore.fetchCategories();

    // 获取所有文章
    const articlesResponse = await contentStore.fetchArticles({
      page: 1,
      size: 10,
    });
    // 初始化总文章数量
    totalArticlesCount.value = articlesResponse.data?.total || 0;

    // 获取活动数据
    await activityStore.fetchActivityData();
    
    // 获取作者榜数据
    await fetchAuthorRanking();
  } catch (error) {
    console.error("获取数据失败:", error);
  }
});

// 选择分类
const selectCategory = async (categoryId: number | null) => {
  selectedCategoryId.value = categoryId;
  await fetchArticlesByCategory();
};

// 根据分类获取文章
const fetchArticlesByCategory = async () => {
  try {
    // 获取当前分类的文章
    const articlesResponse = await contentStore.fetchArticles({
      page: 1,
      size: 10,
      categoryId: selectedCategoryId.value || undefined,
    });

    // 如果是全部文章，更新总文章数量
    if (selectedCategoryId.value === null) {
      totalArticlesCount.value = articlesResponse.data?.total || 0;
    }
  } catch (error) {
    console.error("获取文章失败:", error);
  }
};

// 处理日期点击事件
const handleDateClick = (date: string, data: ActivityData | undefined) => {
  console.log("点击了日期:", date, data);
};

// 处理年份切换事件
const handleYearChange = async (year: number) => {
  console.log("切换到年份:", year);
  await activityStore.fetchActivityData(year);
};

// 处理文章榜"换一换"事件
const refreshArticles = () => {
  // 这里可以实现更复杂的逻辑，比如随机选择不同的文章
  // 目前简单实现为重新排序
  console.log("刷新文章榜");
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

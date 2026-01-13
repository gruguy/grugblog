<template>
  <div class="max-w-6xl mx-auto min-h-[600px]">
    <div class="bg-card border border-border rounded-lg shadow-md">
      <!-- 左侧菜单栏 + 右侧内容 -->
      <div class="flex flex-col md:flex-row min-h-[600px]">
        <!-- 左侧菜单栏 -->
        <div class="md:w-48 border-r border-border bg-muted/50 flex-shrink-0">
          <div class="p-4 border-b border-border">
            <h2 class="text-lg font-bold">个人中心</h2>
          </div>
          <div class="py-2">
            <button
              v-for="menu in menuItems"
              :key="menu.key"
              @click="activeMenu = menu.key"
              :class="[
                'flex items-center gap-2 w-full px-3 py-2 text-left transition-colors text-sm',
                activeMenu === menu.key
                  ? 'bg-primary/10 text-primary font-medium border-l-4 border-primary'
                  : 'text-foreground hover:bg-muted',
              ]"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="menu.icon"
                ></path>
              </svg>
              <span>{{ menu.label }}</span>
            </button>
          </div>
        </div>

        <!-- 右侧内容区域 -->
        <div class="flex-1 p-8">
          <!-- 基础信息 -->
          <div v-if="activeMenu === 'basic'">
            <!-- 用户信息卡片 -->
            <div class="flex flex-col md:flex-row gap-4 mb-12">
              <!-- 左侧：头像和基本信息 -->
              <div class="md:w-1/3">
                <div class="flex flex-col items-center">
                  <div class="relative mb-4">
                    <div
                      v-if="!userStore.user?.avatar"
                      class="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl border-4 border-primary"
                    >
                      {{
                        userStore.user?.username.charAt(0).toUpperCase() || "U"
                      }}
                    </div>
                    <img
                      v-else
                      :src="userStore.user?.avatar"
                      alt="头像"
                      class="w-32 h-32 rounded-full object-cover border-4 border-primary"
                    />
                    <button
                      class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-2 border-card hover:bg-primary/90 transition-colors"
                      @click="triggerFileInput"
                      :disabled="isEditing"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        ></path>
                      </svg>
                    </button>
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleAvatarUpload"
                    />
                  </div>
                  <h2 class="text-2xl font-bold mb-2">
                    {{ userStore.user?.username || "用户" }}
                  </h2>
                  <p class="text-muted-foreground mb-4">
                    {{ userStore.user?.email || "未设置邮箱" }}
                  </p>
                  <div class="flex space-x-4 mb-4">
                    <div class="text-center">
                      <div class="text-xl font-bold">
                        {{ likedArticles.length }}
                      </div>
                      <div class="text-sm text-muted-foreground">点赞</div>
                    </div>
                    <div class="text-center">
                      <div class="text-xl font-bold">
                        {{ collectedArticles.length }}
                      </div>
                      <div class="text-sm text-muted-foreground">收藏</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 右侧：详细信息 -->
              <div class="md:w-2/3">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-xl font-bold">个人信息</h3>
                  <div class="flex space-x-2">
                    <button
                      v-if="!isEditing"
                      @click="startEdit"
                      class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      v-if="isEditing"
                      @click="cancelEdit"
                      class="bg-muted text-foreground px-4 py-2 rounded-md hover:bg-muted/80 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      v-if="isEditing"
                      @click="saveEdit"
                      class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    >
                      保存
                    </button>
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium mb-1"
                        >用户名</label
                      >
                      <p class="text-foreground">
                        {{ userStore.user?.username || "未设置" }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-1">邮箱</label>
                      <p class="text-foreground">
                        {{ userStore.user?.email || "未设置" }}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">昵称</label>
                    <input
                      v-if="isEditing"
                      v-model="editForm.nickname"
                      type="text"
                      class="w-full p-2 border border-border rounded-md"
                      placeholder="请输入昵称"
                    />
                    <p v-else class="text-foreground">
                      {{ userStore.user?.nickname || "未设置" }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1"
                      >个人简介</label
                    >
                    <textarea
                      v-if="isEditing"
                      v-model="editForm.bio"
                      class="w-full p-2 border border-border rounded-md resize-none h-24"
                      placeholder="请输入个人简介"
                    ></textarea>
                    <p v-else class="text-foreground">
                      {{ userStore.user?.bio || "未设置" }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 活动日历 -->
            <div class="mt-12 mb-12">
              <h3 class="text-xl font-bold mb-6">我的活动日历</h3>
              <GitHubStyleCalendar
                :data="activityStore.activityData"
                :title="'我的活动日历'"
                :show-legend="true"
                @click="handleDateClick"
                @yearChange="handleYearChange"
              />
            </div>
          </div>

          <!-- 点赞内容 -->
          <div v-else-if="activeMenu === 'liked'">
            <h3 class="text-xl font-bold mb-6">点赞内容</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="article in likedArticles"
                :key="article.id"
                class="bg-muted rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3
                  class="text-lg font-bold mb-2 text-foreground hover:text-primary transition-colors"
                >
                  <router-link :to="`/article/${article.id}`">{{
                    article.title
                  }}</router-link>
                </h3>
                <p class="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {{ article.summary }}
                </p>
                <div
                  class="flex items-center justify-between text-xs text-muted-foreground"
                >
                  <span>{{
                    new Date(article.createdAt).toLocaleDateString()
                  }}</span>
                  <span
                    >{{ article.views }} 阅读 · {{ article.likes }} 点赞</span
                  >
                </div>
              </div>
              <div
                v-if="likedArticles.length === 0"
                class="col-span-1 md:col-span-2 text-center py-12 text-muted-foreground"
              >
                还没有点赞内容
              </div>
            </div>
          </div>

          <!-- 收藏内容 -->
          <div v-else-if="activeMenu === 'collected'">
            <h3 class="text-xl font-bold mb-6">收藏内容</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="article in collectedArticles"
                :key="article.id"
                class="bg-muted rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3
                  class="text-lg font-bold mb-2 text-foreground hover:text-primary transition-colors"
                >
                  <router-link :to="`/article/${article.id}`">{{
                    article.title
                  }}</router-link>
                </h3>
                <p class="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {{ article.summary }}
                </p>
                <div
                  class="flex items-center justify-between text-xs text-muted-foreground"
                >
                  <span>{{
                    new Date(article.createdAt).toLocaleDateString()
                  }}</span>
                  <span
                    >{{ article.views }} 阅读 · {{ article.likes }} 点赞</span
                  >
                </div>
              </div>
              <div
                v-if="collectedArticles.length === 0"
                class="col-span-1 md:col-span-2 text-center py-12 text-muted-foreground"
              >
                还没有收藏内容
              </div>
            </div>
          </div>

          <!-- 关注的人 -->
          <div v-else-if="activeMenu === 'following'">
            <h3 class="text-xl font-bold mb-6">关注的作者</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="author in followedAuthors"
                :key="author.id"
                class="bg-muted rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex items-center gap-4">
                  <div class="relative">
                    <div
                      v-if="!author.avatar"
                      class="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg border-2 border-primary"
                    >
                      {{ author.username.charAt(0).toUpperCase() || "U" }}
                    </div>
                    <img
                      v-else
                      :src="author.avatar"
                      alt="头像"
                      class="w-16 h-16 rounded-full object-cover border-2 border-primary"
                    />
                  </div>
                  <div class="flex-1">
                    <h3
                      class="text-lg font-bold text-foreground hover:text-primary transition-colors"
                    >
                      {{ author.username }}
                    </h3>
                    <p class="text-muted-foreground text-sm mb-2">
                      {{ author.nickname || "未设置昵称" }}
                    </p>
                    <p class="text-muted-foreground text-xs line-clamp-2">
                      {{ author.bio || "未设置简介" }}
                    </p>
                    <div
                      class="flex items-center gap-4 mt-2 text-xs text-muted-foreground"
                    >
                      <span>{{ author.articleCount || 0 }} 篇文章</span>
                      <span>{{ author.followerCount || 0 }} 位粉丝</span>
                    </div>
                  </div>
                  <button
                    class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm"
                    @click="unfollowUser(author.id)"
                  >
                    已关注
                  </button>
                </div>
              </div>
              <div
                v-if="followedAuthors.length === 0"
                class="col-span-1 md:col-span-2 text-center py-12 text-muted-foreground"
              >
                还没有关注的作者
              </div>
            </div>
          </div>

          <!-- 消息中心 -->
          <div v-else-if="activeMenu === 'messages'">
            <h3 class="text-xl font-bold mb-6">消息中心</h3>
            <div class="space-y-4">
              <Empty
                v-if="messages.length === 0"
                title="暂无消息"
                description="还没有人关注你或给你点赞，继续努力吧！"
              />
              <div
                v-for="msg in messages"
                :key="msg.id"
                class="flex items-start gap-4 p-3 rounded-md hover:bg-muted transition-colors"
              >
                <!-- 用户头像 -->
                <div class="flex-shrink-0">
                  <div
                    v-if="!msg.fromUser.avatar"
                    class="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium text-sm border border-border"
                  >
                    {{ msg.fromUser.username.charAt(0).toUpperCase() }}
                  </div>
                  <img
                    v-else
                    :src="msg.fromUser.avatar"
                    alt="头像"
                    class="w-12 h-12 rounded-full object-cover border border-border"
                  />
                </div>

                <!-- 消息内容 -->
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-medium">{{ msg.fromUser.username }}</span>
                    <span class="text-sm text-muted-foreground">{{
                      msg.content
                    }}</span>
                  </div>
                  <div
                    v-if="msg.articleTitle"
                    class="text-sm text-primary hover:underline mb-1"
                  >
                    {{ msg.articleTitle }}
                  </div>
                  <div class="text-xs text-muted-foreground">
                    {{ msg.createdAt }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "~/stores/userStore";
import { useActivityStore } from "~/stores/activityStore";
import type { ActivityData } from "@/types/activity";

// 引入组件
import GitHubStyleCalendar from "@/components/GitHubStyleCalendar.vue";
import Empty from "@/components/Empty.vue";

const userStore = useUserStore();
const activityStore = useActivityStore();
const activeMenu = ref("basic");
const fileInput = ref<HTMLInputElement | null>(null);

// 使用API组合式函数
const {
  getUserLikedArticles,
  getUserCollectedArticles,
  getFollowedAuthors,
  updateUserInfo,
  unfollowUser,
} = useApi();

// 真实数据，从API获取
const likedArticles = ref<any[]>([]);
const collectedArticles = ref<any[]>([]);
const followedAuthors = ref<any[]>([]);
const isLoading = ref(false);

// 消息数据（模拟）
const messages = ref([
  {
    id: 1,
    type: "follow",
    content: "关注了您",
    fromUser: {
      id: 2,
      username: "张三",
      avatar: "https://picsum.photos/id/1/40/40",
    },
    createdAt: "2026-01-13 10:00:00",
    isRead: false,
  },
  {
    id: 2,
    type: "like",
    content: "给您的文章点赞",
    fromUser: {
      id: 3,
      username: "李四",
      avatar: "https://picsum.photos/id/2/40/40",
    },
    articleId: 1,
    articleTitle: "Vue 3 入门指南",
    createdAt: "2026-01-13 09:30:00",
    isRead: false,
  },
]);

// 菜单配置
const menuItems = ref([
  {
    key: "basic",
    label: "基础信息",
    icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  },
  {
    key: "liked",
    label: "点赞内容",
    icon: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  },
  {
    key: "collected",
    label: "收藏内容",
    icon: "M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z",
  },
  {
    key: "following",
    label: "关注的人",
    icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  },
  {
    key: "messages",
    label: "消息中心",
    icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  },
]);

// 处理日期点击事件
const handleDateClick = (date: string, data: ActivityData | undefined) => {
  console.log("点击了日期:", date, data);
};

// 处理年份切换事件
const handleYearChange = async (year: number) => {
  console.log("切换到年份:", year);
  await activityStore.fetchActivityData(year);
};

// 编辑相关状态
const isEditing = ref(false);
const editForm = ref({
  nickname: "",
  bio: "",
});

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    await userStore.fetchUserInfo();
    // 初始化编辑表单
    if (userStore.user) {
      editForm.value.nickname = userStore.user.nickname || "";
      editForm.value.bio = userStore.user.bio || "";
    }
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
};

// 获取用户点赞的文章
const fetchLikedArticles = async () => {
  try {
    isLoading.value = true;
    const data = await getUserLikedArticles();
    likedArticles.value = data;
  } catch (error) {
    console.error("获取点赞文章失败:", error);
  } finally {
    isLoading.value = false;
  }
};

// 获取用户收藏的文章
const fetchCollectedArticles = async () => {
  try {
    isLoading.value = true;
    const data = await getUserCollectedArticles();
    collectedArticles.value = data;
  } catch (error) {
    console.error("获取收藏文章失败:", error);
  } finally {
    isLoading.value = false;
  }
};

// 获取关注的作者
const fetchFollowedAuthors = async () => {
  try {
    isLoading.value = true;
    const data = await getFollowedAuthors();
    followedAuthors.value = data;
  } catch (error) {
    console.error("获取关注的作者失败:", error);
  } finally {
    isLoading.value = false;
  }
};

// 开始编辑
const startEdit = () => {
  isEditing.value = true;
  // 重置表单值
  if (userStore.user) {
    editForm.value.nickname = userStore.user.nickname || "";
    editForm.value.bio = userStore.user.bio || "";
  }
};

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false;
};

// 保存编辑
const saveEdit = async () => {
  try {
    await updateUserInfo(editForm.value);
    // 更新用户信息
    await fetchUserInfo();
    isEditing.value = false;
  } catch (error) {
    console.error("更新用户信息失败:", error);
  }
};

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 处理头像上传
const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    try {
      // 调用上传API
      const { uploadFile } = await import("@/api/upload");
      const uploadResult = await uploadFile(file);

      // 更新用户头像
      await updateUserInfo({ avatar: uploadResult.url });

      // 重新获取用户信息，更新store
      await fetchUserInfo();

      // 清空文件输入，以便可以重新选择同一文件
      input.value = "";
    } catch (error) {
      console.error("头像上传失败:", error);
      alert("头像上传失败，请重试");
    }
  }
};

onMounted(async () => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    // 重定向到登录页
    window.location.href = "/login";
    return;
  }

  // 获取用户信息和文章数据
  await fetchUserInfo();
  await fetchLikedArticles();
  await fetchCollectedArticles();
  await fetchFollowedAuthors();

  // 获取活动数据
  await activityStore.fetchActivityData();
});
</script>

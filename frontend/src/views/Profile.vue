<template>
  <MainLayout>
    <div class="max-w-6xl mx-auto mt-12">
      <div class="bg-card border border-border rounded-lg shadow-md p-8">
        <!-- 用户信息卡片 -->
        <div class="flex flex-col md:flex-row gap-8 mb-12">
          <!-- 左侧：头像和基本信息 -->
          <div class="md:w-1/3">
            <div class="flex flex-col items-center">
              <div class="relative mb-4">
                <div
                  v-if="!userStore.user?.avatar"
                  class="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl border-4 border-primary"
                >
                  {{ userStore.user?.username.charAt(0).toUpperCase() || "U" }}
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
                  <label class="block text-sm font-medium mb-1">用户名</label>
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
                <label class="block text-sm font-medium mb-1">个人简介</label>
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

        <!-- 内容标签页 -->
        <div class="border-t border-border">
          <div class="flex space-x-8 mb-8">
            <button
              @click="activeTab = 'liked'"
              :class="[
                'py-4 text-sm font-medium transition-colors',
                activeTab === 'liked'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
            >
              点赞内容
            </button>
            <button
              @click="activeTab = 'collected'"
              :class="[
                'py-4 text-sm font-medium transition-colors',
                activeTab === 'collected'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
            >
              收藏内容
            </button>
            <button
              @click="activeTab = 'following'"
              :class="[
                'py-4 text-sm font-medium transition-colors',
                activeTab === 'following'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
            >
              关注的作者
            </button>
          </div>

          <!-- 点赞内容 -->
          <div
            v-if="activeTab === 'liked'"
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
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
                <span>{{ article.views }} 阅读 · {{ article.likes }} 点赞</span>
              </div>
            </div>
            <div
              v-if="likedArticles.length === 0"
              class="col-span-1 md:col-span-2 text-center py-12 text-muted-foreground"
            >
              还没有点赞内容
            </div>
          </div>

          <!-- 收藏内容 -->
          <div
            v-if="activeTab === 'collected'"
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
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
                <span>{{ article.views }} 阅读 · {{ article.likes }} 点赞</span>
              </div>
            </div>
            <div
              v-if="collectedArticles.length === 0"
              class="col-span-1 md:col-span-2 text-center py-12 text-muted-foreground"
            >
              还没有收藏内容
            </div>
          </div>

          <!-- 关注的作者 -->
          <div
            v-if="activeTab === 'following'"
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
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
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import MainLayout from "@/layouts/MainLayout.vue";
import { useUserStore } from "@/stores/userStore";
import {
  getUserLikedArticles,
  getUserCollectedArticles,
  updateUserInfo,
  getFollowedAuthors,
} from "@/api/content";

const userStore = useUserStore();
const activeTab = ref("liked");
const fileInput = ref<HTMLInputElement | null>(null);

// 真实数据，从API获取
const likedArticles = ref<any[]>([]);
const collectedArticles = ref<any[]>([]);
const followedAuthors = ref<any[]>([]);
const isLoading = ref(false);

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

// 取消关注用户
const unfollowUser = async (userId: number) => {
  try {
    await import("@/api/content").then(({ unfollowUser }) =>
      unfollowUser(userId)
    );
    // 更新关注的作者列表
    await fetchFollowedAuthors();
  } catch (error) {
    console.error("取消关注失败:", error);
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
    // 这里需要实现头像上传逻辑
    console.log("上传头像:", file);
    // 实际项目中应该调用上传API，然后更新用户头像
    // await userStore.updateAvatar(file)
    alert("头像上传功能还未实现");
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
});
</script>

<template>
  <MainLayout>
    <div class="space-y-6">
      <h1 class="text-3xl font-bold">音乐馆</h1>
      <div v-if="contentStore.musicLoading" class="text-center py-12">
        <p class="text-muted-foreground">加载中...</p>
      </div>
      <div
        v-else-if="contentStore.musicList.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="music in contentStore.musicList"
          :key="music.id"
          class="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition-shadow"
        >
          <div
            class="aspect-square mb-4 rounded-lg overflow-hidden cursor-pointer relative group"
            @click="openScoreModal(music)"
          >
            <img
              :src="music.cover"
              :alt="music.name"
              class="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div
              v-if="music.scores && music.scores.length > 0"
              class="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded-full text-sm"
            >
              乐谱 × {{ music.scores.length }}
            </div>
          </div>
          <h3 class="text-lg font-bold mb-1">{{ music.name }}</h3>
          <p class="text-muted-foreground mb-4">{{ music.artist }}</p>
          <button
            @click="playMusic(music)"
            class="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            播放
          </button>
        </div>
      </div>
      <Empty
        v-else
        title="暂无音乐"
        description="目前没有上传任何音乐，敬请期待"
      />
    </div>

    <!-- 乐谱展示Modal - 使用项目封装的Modal组件 -->
    <Modal
      v-model="scoreModalVisible"
      :title="`${currentMusic?.name || ''} - 乐谱`"
      :fullscreen="isFullscreen"
      class="score-modal"
    >
      <template #header-extra>
        <div class="flex gap-2">
          <button
            @click="toggleFullscreen"
            class="p-2 hover:bg-border rounded-full transition-colors"
            :title="isFullscreen ? '退出全屏' : '全屏'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                v-if="!isFullscreen"
                d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
              ></path>
              <path
                v-else
                d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 8h3a2 2 0 0 1 2 2v3"
              ></path>
            </svg>
          </button>
        </div>
      </template>

      <!-- 乐谱内容 -->
      <div
        class="relative"
        :class="{
          'h-[70vh]': !isFullscreen,
          'h-full': isFullscreen,
        }"
      >
        <div
          class="w-full bg-cover bg-center"
          :class="{
            'h-full': true,
          }"
          v-if="
            currentMusic &&
            currentMusic.scores &&
            currentMusic.scores.length > 0
          "
        >
          <!-- 左右箭头 -->
          <button
            v-if="currentMusic.scores.length > 1"
            @click="prevScore"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-10"
            title="上一张"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            v-if="currentMusic.scores.length > 1"
            @click="nextScore"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-10"
            title="下一张"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <!-- 乐谱容器 -->
          <div class="w-full h-full overflow-hidden relative">
            <div
              class="absolute inset-0 flex transition-transform duration-300 ease-in-out"
              :style="{
                transform: `translateX(-${currentScoreIndex * 100}%)`,
              }"
            >
              <div
                v-for="(score, index) in currentMusic.scores"
                :key="index"
                class="w-full flex-shrink-0 h-full flex items-center justify-center p-6"
              >
                <div
                  class="w-full h-full mx-auto bg-gray-100 rounded-lg overflow-hidden"
                  :class="{
                    'max-w-4xl': !isFullscreen,
                    'max-w-full': isFullscreen,
                  }"
                >
                  <img
                    v-if="isImage(score)"
                    :src="score"
                    alt="乐谱"
                    class="w-full h-full object-contain"
                  />
                  <iframe
                    v-else-if="isPdf(score)"
                    :src="score"
                    class="w-full h-full"
                    frameborder="0"
                  ></iframe>
                  <div
                    v-else
                    class="w-full h-full flex flex-col items-center justify-center p-8 gap-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="80"
                      height="80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="text-gray-400"
                    >
                      <path
                        d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                      ></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <h3 class="text-xl font-semibold text-gray-600">
                      {{ getFileName(score) }}
                    </h3>
                    <button
                      @click="downloadScore(score)"
                      class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      下载文件
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页指示器 -->
          <div
            class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10"
          >
            <span
              v-for="(_, index) in currentMusic.scores"
              :key="index"
              class="w-3 h-3 rounded-full bg-black/50 hover:bg-black/70 transition-all cursor-pointer"
              :class="{ 'bg-primary w-8': currentScoreIndex === index }"
              @click="currentScoreIndex = index"
            ></span>
          </div>
        </div>
        <div
          v-else
          class="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
            ></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="18" y1="13" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12" y2="13"></line>
          </svg>
          <p class="text-lg">暂无乐谱文件</p>
        </div>
      </div>
    </Modal>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MainLayout from "@/layouts/MainLayout.vue";
import Empty from "@/components/Empty.vue";
import Modal from "@/components/Modal.vue";
import { useContentStore } from "@/stores/contentStore";
import type { Music } from "@/types/content";

const contentStore = useContentStore();

// 乐谱Modal相关
const scoreModalVisible = ref(false);
const currentMusic = ref<Music | null>(null);
const currentScoreIndex = ref(0);
const isFullscreen = ref(false);

const playMusic = (music: Music) => {
  // TODO: 集成 APlayer 播放器
  console.log("播放音乐:", music);
};

// 打开乐谱Modal
const openScoreModal = (music: Music) => {
  currentMusic.value = music;
  currentScoreIndex.value = 0;
  scoreModalVisible.value = true;
};

// 上一张乐谱
const prevScore = () => {
  if (currentMusic.value && currentScoreIndex.value > 0) {
    currentScoreIndex.value--;
  }
};

// 下一张乐谱
const nextScore = () => {
  if (
    currentMusic.value &&
    currentScoreIndex.value < currentMusic.value.scores!.length - 1
  ) {
    currentScoreIndex.value++;
  }
};

// 判断是否为图片文件
const isImage = (url: string) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const ext = url.substring(url.lastIndexOf(".")).toLowerCase();
  return imageExtensions.includes(ext);
};

// 判断是否为PDF文件
const isPdf = (url: string) => {
  return url.toLowerCase().endsWith(".pdf");
};

// 获取文件名
const getFileName = (url: string) => {
  return url.substring(url.lastIndexOf("/") + 1);
};

// 下载乐谱
const downloadScore = (url: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = getFileName(url);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

onMounted(async () => {
  await contentStore.fetchMusicList();
});
</script>

<style scoped>
/* 乐谱Modal样式 */
.score-modal {
  /* 覆盖默认Modal的最大宽度 */
  /* max-width: 80% !important; */
}
</style>

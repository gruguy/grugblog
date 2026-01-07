<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold">Vlog</h1>
    <div v-if="contentStore.videoLoading" class="text-center py-12">
      <p class="text-muted-foreground">加载中...</p>
    </div>
    <div
      v-else-if="contentStore.videoList.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="video in contentStore.videoList"
        :key="video.id"
        class="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
      >
        <div class="aspect-video relative">
          <img
            v-if="video.cover"
            :src="video.cover"
            :alt="video.title"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 flex items-center justify-center bg-black/50"
          >
            <button
              @click="playVideo(video)"
              class="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
            >
              <svg
                class="w-8 h-8 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-bold mb-2">{{ video.title }}</h3>
          <p
            v-if="video.description"
            class="text-muted-foreground mb-4 line-clamp-2"
          >
            {{ video.description }}
          </p>
          <div
            class="flex items-center justify-between text-sm text-muted-foreground"
          >
            <span>{{ formatDate(video.createdAt) }}</span>
            <span>{{ video.playCount }} 播放</span>
          </div>
        </div>
      </div>
    </div>
    <Empty
      v-else
      title="暂无视频"
      description="目前没有上传任何视频，敬请期待"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import dayjs from "dayjs";
import { useContentStore } from "@/stores/contentStore";
import type { Video } from "@/types/content";
import Empty from "@/components/Empty.vue";

const contentStore = useContentStore();

const formatDate = (date: string) => {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};

const playVideo = (video: Video) => {
  // TODO: 集成视频播放器
  console.log("播放视频:", video);
};

onMounted(async () => {
  await contentStore.fetchVideoList();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

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
          <div class="aspect-square mb-4 rounded-lg overflow-hidden">
            <img
              :src="music.cover"
              :alt="music.name"
              class="w-full h-full object-cover"
            />
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
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import MainLayout from "@/layouts/MainLayout.vue";
import Empty from "@/components/Empty.vue";
import { useContentStore } from "@/stores/contentStore";
import type { Music } from "@/types/content";

const contentStore = useContentStore();

const playMusic = (music: Music) => {
  // TODO: 集成 APlayer 播放器
  console.log("播放音乐:", music);
};

onMounted(async () => {
  await contentStore.fetchMusicList();
});
</script>

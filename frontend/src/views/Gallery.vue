<template>
  <MainLayout>
    <div class="space-y-6">
      <h1 class="text-3xl font-bold">相册</h1>
      <div v-if="contentStore.imageLoading" class="text-center py-12">
        <p class="text-muted-foreground">加载中...</p>
      </div>
      <div
        v-else-if="contentStore.imageList.length > 0"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <div
          v-for="image in contentStore.imageList"
          :key="image.id"
          class="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          @click="previewImage(image)"
        >
          <img
            :src="image.thumbnail || image.url"
            :alt="image.name"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
      <Empty
        v-else
        title="暂无图片"
        description="目前没有上传任何图片，敬请期待"
      />
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import MainLayout from "@/layouts/MainLayout.vue";
import Empty from "@/components/Empty.vue";
import { useContentStore } from "@/stores/contentStore";
import type { Image } from "@/types/content";

const contentStore = useContentStore();

const previewImage = (image: Image) => {
  // TODO: 集成 ViewerJS 图片预览
  console.log("预览图片:", image);
};

onMounted(async () => {
  await contentStore.fetchImageList();
});
</script>

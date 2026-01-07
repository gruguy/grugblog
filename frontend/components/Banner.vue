<template>
  <section
    class="relative h-96 rounded-lg overflow-hidden mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
  >
    <!-- 粒子动画容器 -->
    <div class="absolute inset-0 z-0">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="absolute rounded-full bg-white/20"
        :style="{
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          animationDuration: `${particle.duration}s`,
          animationDelay: `${particle.delay}s`,
        }"
        :class="['animate-float', `opacity-${particle.opacity}`]"
      ></div>
    </div>

    <!-- 视频轮播容器 -->
    <div class="relative w-full h-full">
      <!-- 轮播视频 -->
      <div class="absolute inset-0 w-full h-full overflow-hidden z-10">
        <div
          v-for="(banner, index) in banners"
          :key="banner.id"
          class="absolute inset-0"
          :class="{
            'opacity-100': currentIndex === index,
            'opacity-0': currentIndex !== index,
          }"
        >
          <video
            ref="videoRefs"
            :src="banner.src"
            class="w-full h-full object-cover"
            autoplay
            muted
            loop
            playsinline
            preload="auto"
            controlsList="nodownload noplaybackrate"
          ></video>
        </div>
      </div>

      <!-- 视频左侧渐变融入背景，降低透明度 -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent z-15"
      ></div>

      <!-- 装饰性网格线，降低透明度 -->
      <div
        class="absolute inset-0 bg-grid-white/[0.02] bg-[length:40px_40px] z-20"
      ></div>

      <!-- 发光效果，调整位置到右侧 -->
      <div
        class="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse z-15"
      ></div>

      <!-- 文字内容 -->
      <div
        class="relative h-full flex items-center justify-start pl-12 text-white z-30"
      >
        <div class="max-w-lg">
          <h1
            class="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up animate-delay-100"
          >
            {{ currentBanner.title }}
          </h1>
          <p class="text-xl md:text-2xl animate-fade-in-up animate-delay-300">
            {{ currentBanner.description }}
          </p>
        </div>
      </div>

      <!-- 轮播指示器 -->
      <div class="absolute bottom-4 left-12 flex space-x-2 z-30">
        <button
          v-for="(banner, index) in banners"
          :key="banner.id"
          @click="goToSlide(index)"
          class="w-3 h-3 rounded-full transition-all duration-300"
          :class="{
            'bg-white w-8': currentIndex === index,
            'bg-white/50': currentIndex !== index,
          }"
        ></button>
      </div>

      <!-- 轮播控制按钮 -->
      <button
        @click="prevSlide"
        class="absolute left-12 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center z-30 transition-all"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
      <button
        @click="nextSlide"
        class="absolute right-12 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center z-30 transition-all"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

// 直接导入视频资源
import springVideo from "@/assets/spring.mp4";
import summerVideo from "@/assets/summer.mp4";
import autumnVideo from "@/assets/autumn.mp4";
import winterVideo from "@/assets/winter.mp4";

// 定义banner类型
interface BannerItem {
  id: number;
  src: string;
  title: string;
  description: string;
  type: "video" | "image";
}

// 定义粒子类型
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

// 接收外部传入的banner列表，如果没有则使用默认值
const props = withDefaults(
  defineProps<{
    banners?: BannerItem[];
  }>(),
  {
    banners: () => [
      {
        id: 1,
        src: springVideo,
        title: "春日暖阳",
        description: "春暖花开，万物复苏",
        type: "video",
      },
      {
        id: 2,
        src: summerVideo,
        title: "夏日时光",
        description: "享受阳光与海滩",
        type: "video",
      },
      {
        id: 3,
        src: autumnVideo,
        title: "秋日私语",
        description: "感受秋日的温暖",
        type: "video",
      },
      {
        id: 4,
        src: winterVideo,
        title: "冬日恋歌",
        description: "雪花飞舞的季节",
        type: "video",
      },
    ],
  }
);

// 当前轮播索引
const currentIndex = ref(0);

// 粒子数组
const particles = ref<Particle[]>([]);

// 视频引用数组
const videoRefs = ref<HTMLVideoElement[]>([]);

// 自动轮播定时器
let timer: number | null = null;

// 当前banner信息
const currentBanner = computed(() => {
  return props.banners[currentIndex.value];
});

// 生成随机粒子
const generateParticles = () => {
  const newParticles: Particle[] = [];
  for (let i = 0; i < 20; i++) {
    newParticles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.floor(Math.random() * 50) + 10,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 2,
    });
  }
  particles.value = newParticles;
};

// 尝试播放视频
const playVideos = () => {
  if (videoRefs.value.length > 0) {
    videoRefs.value.forEach((video) => {
      if (video) {
        // 尝试播放视频，忽略错误
        video.play().catch((err) => {
          console.log("自动播放失败，需要用户交互:", err);
        });
      }
    });
  }
};

// 监听用户交互事件，触发视频播放
const handleUserInteraction = () => {
  playVideos();
  // 移除事件监听，避免重复触发
  document.removeEventListener("click", handleUserInteraction);
  document.removeEventListener("touchstart", handleUserInteraction);
  document.removeEventListener("mousemove", handleUserInteraction);
};

// 跳转到指定幻灯片
const goToSlide = (index: number) => {
  currentIndex.value = index;
};

// 上一张幻灯片
const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + props.banners.length) % props.banners.length;
};

// 下一张幻灯片
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.banners.length;
};

// 启动自动轮播
const startAutoPlay = () => {
  timer = window.setInterval(() => {
    nextSlide();
  }, 5000); // 5秒切换一次
};

// 停止自动轮播
const stopAutoPlay = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

onMounted(() => {
  startAutoPlay();
  generateParticles();

  // 初始尝试播放视频
  playVideos();

  // 添加用户交互事件监听器，确保在手机浏览器中能够播放视频
  document.addEventListener("click", handleUserInteraction);
  document.addEventListener("touchstart", handleUserInteraction);
  document.addEventListener("mousemove", handleUserInteraction);
});

onUnmounted(() => {
  stopAutoPlay();

  // 移除事件监听器
  document.removeEventListener("click", handleUserInteraction);
  document.removeEventListener("touchstart", handleUserInteraction);
  document.removeEventListener("mousemove", handleUserInteraction);
});
</script>

<style scoped>
/* 文字渐入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-delay-100 {
  animation-delay: 0.1s;
}

.animate-delay-300 {
  animation-delay: 0.3s;
}

/* 粒子浮动动画 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-10px) translateX(5px);
  }
  50% {
    transform: translateY(0px) translateX(10px);
  }
  75% {
    transform: translateY(10px) translateX(5px);
  }
}

.animate-float {
  animation: float infinite linear;
}

/* 网格背景样式 */
.bg-grid-white {
  background-image: linear-gradient(to right, white 1px, transparent 1px),
    linear-gradient(to bottom, white 1px, transparent 1px);
}

/* 视频切换过渡效果 */
video {
  transition: opacity 0.5s ease-in-out;
}

/* 视频渐变遮罩层 */
.gradient-overlay {
  background-color: rgba(59, 130, 246, 0.8);
}

/* 轮播项过渡效果 */
.absolute {
  transition: opacity 0.5s ease-in-out;
}
</style>

<template>
  <div
    class="markdown-anchor fixed right-8 top-24 w-56 bg-card rounded-xl border border-border p-4 shadow-md overflow-auto max-h-[calc(100vh-12rem)] z-10 transition-all duration-300"
    v-if="headings.length > 0"
  >
    <h3
      class="text-sm font-semibold mb-3 text-muted-foreground flex items-center"
    >
      <svg
        class="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h8m-8 6h16"
        ></path>
      </svg>
      文章目录
    </h3>
    <ul class="space-y-2">
      <li
        v-for="heading in headings"
        :key="heading.id"
        :class="[
          { 'font-medium text-primary': activeHeadingId === heading.id },
          { 'text-muted-foreground': activeHeadingId !== heading.id },
        ]"
      >
        <a
          :href="`#${heading.id}`"
          @click.prevent="scrollToHeading(heading.id)"
          class="block px-2 py-1.5 rounded-lg transition-all duration-200 hover:bg-muted hover:text-primary"
          :class="heading.level === 1 ? 'text-sm font-medium' : 'text-xs'"
        >
          {{ heading.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";

// Props
const props = defineProps<{
  htmlContent: string;
}>();

// 定义标题类型
interface Heading {
  id: string;
  text: string;
  level: number;
}

// 状态管理
const headings = ref<Heading[]>([]);
const activeHeadingId = ref<string>("");
const headingElements = ref<Map<string, HTMLElement>>(new Map());

// 生成唯一ID
const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

// 解析HTML内容，提取标题（只显示一二级）
const parseHeadings = (html: string): Heading[] => {
  const headings: Heading[] = [];
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/g;
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    // 只包含一二级标题
    if (level > 2) continue;

    const text = match[2].replace(/<[^>]+>/g, "").trim();
    const id = generateId(text);

    headings.push({
      id,
      text,
      level,
    });
  }

  return headings;
};

// 更新HTML内容，为标题添加ID
const updateHtmlWithIds = (html: string): string => {
  return html.replace(
    /<h([1-6])[^>]*>(.*?)<\/h\1>/g,
    (_match, level, content) => {
      const text = content.replace(/<[^>]+>/g, "").trim();
      const id = generateId(text);
      return `<h${level} id="${id}">${content}</h${level}>`;
    }
  );
};

// 滚动到指定标题
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

// 监听滚动，更新当前激活的标题
const handleScroll = () => {
  const scrollPosition = window.scrollY + 100;

  let currentActiveId = "";

  headingElements.value.forEach((element, id) => {
    if (element.offsetTop <= scrollPosition) {
      currentActiveId = id;
    }
  });

  activeHeadingId.value = currentActiveId;
};

// 初始化标题元素映射
const initHeadingElements = () => {
  const elements = new Map<string, HTMLElement>();

  headings.value.forEach((heading) => {
    const element = document.getElementById(heading.id);
    if (element) {
      elements.set(heading.id, element);
    }
  });

  headingElements.value = elements;
};

// 监听HTML内容变化，重新解析标题
watch(
  () => props.htmlContent,
  (newContent) => {
    headings.value = parseHeadings(newContent);

    nextTick(() => {
      initHeadingElements();
      handleScroll();
    });
  },
  { immediate: true }
);

// 生命周期钩子
onMounted(() => {
  window.addEventListener("scroll", handleScroll);

  nextTick(() => {
    initHeadingElements();
    handleScroll();
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// 暴露更新HTML的方法，供父组件调用
defineExpose({
  updateHtmlWithIds,
});
</script>

<style scoped>
.markdown-anchor {
  backdrop-filter: blur(10px);
}

/* 滚动条样式 */
.markdown-anchor::-webkit-scrollbar {
  width: 6px;
}

.markdown-anchor::-webkit-scrollbar-track {
  background: var(--background);
  border-radius: 3px;
}

.markdown-anchor::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

.markdown-anchor::-webkit-scrollbar-thumb:hover {
  background: var(--muted-foreground);
}
</style>

import { defineStore } from "pinia";
import { ref } from "vue";
import type { Article, Music, Image, Video, Category } from "@/types/content";

export const useContentStore = defineStore("content", () => {
  // 文章相关
  const articles = ref<Article[]>([]);
  const currentArticle = ref<Article | null>(null);
  const articleLoading = ref<boolean>(false);
  const currentPage = ref<number>(1);
  const totalArticles = ref<number>(0);
  const hasMore = ref<boolean>(true);
  const isLoadingMore = ref<boolean>(false);

  // 音乐相关
  const musicList = ref<Music[]>([]);
  const musicLoading = ref<boolean>(false);

  // 图片相关
  const imageList = ref<Image[]>([]);
  const imageLoading = ref<boolean>(false);

  // 视频相关
  const videoList = ref<Video[]>([]);
  const videoLoading = ref<boolean>(false);

  // 分类相关
  const categories = ref<Category[]>([]);
  const categoryLoading = ref<boolean>(false);
  const currentCategoryId = ref<number | null>(null);

  // 获取文章列表
  const fetchArticles = async (params?: {
    page?: number;
    size?: number;
    categoryId?: number;
    tagId?: number;
    append?: boolean;
  }) => {
    const {
      page = 1,
      size = 10,
      categoryId,
      tagId,
      append = false,
    } = params || {};

    // 如果是首次加载或切换分类，重置状态
    if (page === 1 || categoryId !== currentCategoryId.value) {
      currentPage.value = 1;
      totalArticles.value = 0;
      hasMore.value = true;
      if (!append) {
        articles.value = [];
      }
      currentCategoryId.value = categoryId || null;
    }

    // 如果没有更多数据或正在加载，直接返回
    if (!hasMore.value || isLoadingMore.value) {
      return;
    }

    // 设置加载状态
    if (append) {
      isLoadingMore.value = true;
    } else {
      articleLoading.value = true;
    }

    try {
      const { $axios } = useNuxtApp();
      const response = await $axios.get("/articles", {
        params: {
          page,
          size,
          categoryId,
          tagId,
        },
      });

      const newArticles = response.list || [];

      // 更新文章列表
      if (append) {
        articles.value = [...articles.value, ...newArticles];
      } else {
        articles.value = newArticles;
      }

      // 更新分页信息
      totalArticles.value = response.total || 0;
      currentPage.value = page;
      hasMore.value = articles.value.length < totalArticles.value;

      return response;
    } finally {
      // 重置加载状态
      if (append) {
        isLoadingMore.value = false;
      } else {
        articleLoading.value = false;
      }
    }
  };

  // 加载更多文章
  const loadMoreArticles = async () => {
    if (!hasMore.value || isLoadingMore.value) {
      return;
    }

    return await fetchArticles({
      page: currentPage.value + 1,
      size: 10,
      categoryId: currentCategoryId.value || undefined,
      append: true,
    });
  };

  // 获取文章详情
  const fetchArticleById = async (id: number) => {
    articleLoading.value = true;
    try {
      const { $axios } = useNuxtApp();
      const response = await $axios.get(`/articles/${id}`);
      // 后端直接返回文章详情，而不是包装在data字段中
      // 确保collects字段被正确初始化
      const article = {
        ...response,
        collects: response.collects || 0,
        likes: response.likes || 0,
      };
      currentArticle.value = article;
      return article;
    } finally {
      articleLoading.value = false;
    }
  };

  // 获取音乐列表
  const fetchMusicList = async () => {
    musicLoading.value = true;
    try {
      const { $axios } = useNuxtApp();
      const response = await $axios.get("/music");
      // 后端直接返回音乐列表，而不是包装在data字段中
      // 确保每个音乐对象都有scores字段，即使后端没有返回
      musicList.value = (response || []).map((music) => ({
        ...music,
        scores: music.scores || [],
      }));
      return musicList.value;
    } finally {
      musicLoading.value = false;
    }
  };

  // 获取图片列表
  const fetchImageList = async (params?: { categoryId?: number }) => {
    imageLoading.value = true;
    try {
      const { $axios } = useNuxtApp();
      const response = await $axios.get("/images", { params });
      // 后端直接返回图片列表，而不是包装在data字段中
      imageList.value = response || [];
      return response;
    } finally {
      imageLoading.value = false;
    }
  };

  // 获取视频列表
  const fetchVideoList = async () => {
    videoLoading.value = true;
    try {
      const { $axios } = useNuxtApp();
      const response = await $axios.get("/videos");
      // 后端直接返回视频列表，而不是包装在data字段中
      videoList.value = response || [];
      return response;
    } finally {
      videoLoading.value = false;
    }
  };

  // 获取分类列表
  const fetchCategories = async () => {
    categoryLoading.value = true;
    try {
      const { $axios } = useNuxtApp();
      const response = await $axios.get("/articles/categories");
      // 后端直接返回分类列表数据，而不是包装在data字段中
      categories.value = response || [];
      return response;
    } finally {
      categoryLoading.value = false;
    }
  };

  return {
    articles,
    currentArticle,
    articleLoading,
    currentPage,
    totalArticles,
    hasMore,
    isLoadingMore,
    categories,
    categoryLoading,
    currentCategoryId,
    musicList,
    musicLoading,
    imageList,
    imageLoading,
    videoList,
    videoLoading,
    fetchArticles,
    fetchArticleById,
    loadMoreArticles,
    fetchCategories,
    fetchMusicList,
    fetchImageList,
    fetchVideoList,
  };
});

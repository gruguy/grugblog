import { defineStore } from "pinia";
import { ref } from "vue";
import type { Article, Music, Image, Video, Category } from "@/types/content";
import {
  getArticles,
  getArticleById,
  getMusicList,
  getImageList,
  getVideoList,
  getCategories,
} from "@/api/content";

export const useContentStore = defineStore("content", () => {
  // 文章相关
  const articles = ref<Article[]>([]);
  const currentArticle = ref<Article | null>(null);
  const articleLoading = ref<boolean>(false);

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

  // 获取文章列表
  const fetchArticles = async (params?: {
    page?: number;
    size?: number;
    categoryId?: number;
    tagId?: number;
  }) => {
    articleLoading.value = true;
    try {
      const response = await getArticles(params);
      // 后端直接返回文章列表数据，而不是包装在data字段中
      articles.value = response.list || [];
      return response;
    } finally {
      articleLoading.value = false;
    }
  };

  // 获取文章详情
  const fetchArticleById = async (id: number) => {
    articleLoading.value = true;
    try {
      const response = await getArticleById(id);
      // 后端直接返回文章详情，而不是包装在data字段中
      // 确保collects字段被正确初始化
      const article = {
        ...response,
        collects: response.collects || 0,
        likes: response.likes || 0
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
      const response = await getMusicList();
      // 后端直接返回音乐列表，而不是包装在data字段中
      musicList.value = response || [];
      return response;
    } finally {
      musicLoading.value = false;
    }
  };

  // 获取图片列表
  const fetchImageList = async (params?: { categoryId?: number }) => {
    imageLoading.value = true;
    try {
      const response = await getImageList(params);
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
      const response = await getVideoList();
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
      const response = await getCategories();
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
    categories,
    categoryLoading,
    musicList,
    musicLoading,
    imageList,
    imageLoading,
    videoList,
    videoLoading,
    fetchArticles,
    fetchArticleById,
    fetchCategories,
    fetchMusicList,
    fetchImageList,
    fetchVideoList,
  };
});

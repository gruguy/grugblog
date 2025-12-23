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
      articles.value = response.data?.list || [];
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
      currentArticle.value = response.data;
      return response;
    } finally {
      articleLoading.value = false;
    }
  };

  // 获取音乐列表
  const fetchMusicList = async () => {
    musicLoading.value = true;
    try {
      const response = await getMusicList();
      musicList.value = response.data || [];
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
      imageList.value = response.data || [];
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
      videoList.value = response.data || [];
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
      // 后端统一包装的响应格式是 { code, message, data }，所以直接访问 data 即可
      categories.value = response.data || [];
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

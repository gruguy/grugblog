import type {
  Article,
  Music,
  Image,
  Video,
  Category,
  Comment,
} from "@/types/content";
import type { User } from "@/types/user";

export const useApi = () => {
  const { $axios } = useNuxtApp();

  // 内容相关 API
  const getArticles = async (params?: any) => {
    return await $axios.get("/articles", { params });
  };

  const getArticleById = async (id: number) => {
    return await $axios.get(`/articles/${id}`);
  };

  const getMusicList = async (params?: any) => {
    return await $axios.get("/music", { params });
  };

  const getImageList = async (params?: any) => {
    return await $axios.get("/images", { params });
  };

  const getVideoList = async (params?: any) => {
    return await $axios.get("/videos", { params });
  };

  const getCategories = async () => {
    return await $axios.get("/categories");
  };

  // 用户相关 API
  const login = async (data: { username: string; password: string }) => {
    return await $axios.post("/auth/login", data);
  };

  const register = async (data: {
    username: string;
    password: string;
    email: string;
  }) => {
    return await $axios.post("/auth/register", data);
  };

  const getUserInfo = async () => {
    return await $axios.get("/auth/me");
  };

  const logout = async () => {
    return await $axios.post("/auth/logout");
  };

  // 文章交互相关 API
  const toggleArticleLike = async (articleId: number) => {
    return await $axios.post(`/articles/${articleId}/like`);
  };

  const checkArticleLikeStatus = async (articleId: number) => {
    return await $axios.get(`/articles/${articleId}/like/status`);
  };

  const toggleArticleCollect = async (articleId: number) => {
    return await $axios.post(`/articles/${articleId}/collect`);
  };

  const checkArticleCollectStatus = async (articleId: number) => {
    return await $axios.get(`/articles/${articleId}/collect/status`);
  };

  const getArticleComments = async (articleId: number, params?: any) => {
    return await $axios.get(`/comments/article/${articleId}`, { params });
  };

  const createArticleComment = async (
    articleId: number,
    data: {
      content: string;
      parentId?: number;
      author: string;
      avatar?: string;
    }
  ) => {
    return await $axios.post(`/comments`, {
      ...data,
      articleId,
    });
  };

  const toggleCommentLike = async (commentId: number) => {
    return await $axios.post(`/comments/${commentId}/like`);
  };

  return {
    // 内容相关 API
    getArticles,
    getArticleById,
    getMusicList,
    getImageList,
    getVideoList,
    getCategories,
    // 用户相关 API
    login,
    register,
    getUserInfo,
    logout,
    // 文章交互相关 API
    toggleArticleLike,
    checkArticleLikeStatus,
    toggleArticleCollect,
    checkArticleCollectStatus,
    getArticleComments,
    createArticleComment,
    toggleCommentLike,
  };
};

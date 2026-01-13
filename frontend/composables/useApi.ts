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
    return await $axios.get("/auth/user");
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

  // 用户内容相关 API
  const getUserLikedArticles = async () => {
    return await $axios.get("/articles/user/liked");
  };

  const getUserCollectedArticles = async () => {
    return await $axios.get("/articles/user/collected");
  };

  const updateUserInfo = async (data: {
    nickname?: string;
    bio?: string;
    avatar?: string;
  }) => {
    return await $axios.put("/user/info", data);
  };

  const getAuthorRanking = async () => {
    return await $axios.get("/user/ranking");
  };

  const followUser = async (userId: number) => {
    return await $axios.post(`/user/follow/${userId}`);
  };

  const unfollowUser = async (userId: number) => {
    return await $axios.delete(`/user/follow/${userId}`);
  };

  const checkFollowStatus = async (userId: number) => {
    return await $axios.get(`/user/follow/${userId}/status`);
  };

  const getFollowedAuthors = async () => {
    return await $axios.get("/user/following");
  };

  // 文章草稿相关 API
  const saveArticleDraft = async (data: {
    title: string;
    content: string;
    categoryId?: number;
    tags?: string[];
    status?: "draft";
  }) => {
    return await $axios.post("/articles/drafts", data);
  };

  const publishArticle = async (data: {
    title: string;
    content: string;
    categoryId?: number;
    tags?: string[];
    status?: "published";
  }) => {
    return await $axios.post("/articles", data);
  };

  const getUserDrafts = async () => {
    return await $axios.get("/articles/drafts");
  };

  const getDraftById = async (id: number) => {
    return await $axios.get(`/articles/drafts/${id}`);
  };

  // 活动数据相关 API
  const getActivityData = async (year?: number) => {
    return await $axios.get("/articles/activity", {
      params: year ? { year } : {},
    });
  };

  // 消息相关 API
  const getMessages = async (params?: any) => {
    return await $axios.get("/messages", { params });
  };

  const markMessageAsRead = async (id: number) => {
    return await $axios.put(`/messages/${id}/read`);
  };

  const markAllMessagesAsRead = async () => {
    return await $axios.put("/messages/read-all");
  };

  return {
    // 内容相关 API
    getArticles,
    getArticleById,
    getMusicList,
    getImageList,
    getVideoList,
    getCategories,
    getActivityData,
    // 用户相关 API
    login,
    register,
    getUserInfo,
    logout,
    updateUserInfo,
    getAuthorRanking,
    followUser,
    unfollowUser,
    checkFollowStatus,
    getFollowedAuthors,
    // 文章交互相关 API
    toggleArticleLike,
    checkArticleLikeStatus,
    toggleArticleCollect,
    checkArticleCollectStatus,
    getArticleComments,
    createArticleComment,
    toggleCommentLike,
    getUserLikedArticles,
    getUserCollectedArticles,
    // 文章草稿相关 API
    saveArticleDraft,
    publishArticle,
    getUserDrafts,
    getDraftById,
    // 消息相关 API
    getMessages,
    markMessageAsRead,
    markAllMessagesAsRead,
  };
};

import request from "./request";
import type { Article, Music, Image, Video } from "@/types/content";

export interface ArticleListParams {
  page?: number;
  size?: number;
  categoryId?: number;
  tagId?: number;
}

export interface ArticleListResponse {
  list: Article[];
  total: number;
  page: number;
  size: number;
}

// 获取文章列表
export const getArticles = (params?: ArticleListParams) => {
  return request.get<ArticleListResponse>("/articles", { params });
};

// 获取文章详情
export const getArticleById = (id: number) => {
  return request.get<Article>(`/articles/${id}`);
};

// 获取音乐列表
export const getMusicList = () => {
  return request.get<Music[]>("/music");
};

// 获取图片列表
export const getImageList = (params?: { categoryId?: number }) => {
  return request.get<Image[]>("/images", { params });
};

// 获取视频列表
export const getVideoList = () => {
  return request.get<Video[]>("/videos");
};

// 获取文章活动数据
export const getActivityData = () => {
  return request.get<
    Array<{
      date: string;
      count: number;
      description: string;
    }>
  >("/articles/activity");
};

// 获取文章分类列表
export const getCategories = () => {
  return request.get<
    Array<{
      id: number;
      name: string;
      description?: string;
    }>
  >("/articles/categories");
};

// 切换点赞状态
export const toggleArticleLike = (articleId: number) => {
  return request.post<{
    isLiked: boolean;
    likes: number;
  }>(`/articles/${articleId}/like`);
};

// 检查点赞状态
export const checkArticleLikeStatus = (articleId: number) => {
  return request.get<{
    isLiked: boolean;
  }>(`/articles/${articleId}/like/status`);
};

// 切换收藏状态
export const toggleArticleCollect = (articleId: number) => {
  return request.post<{
    isCollected: boolean;
  }>(`/articles/${articleId}/collect`);
};

// 检查收藏状态
export const checkArticleCollectStatus = (articleId: number) => {
  return request.get<{
    isCollected: boolean;
  }>(`/articles/${articleId}/collect/status`);
};

// 获取文章评论列表
export const getArticleComments = (articleId: number) => {
  return request.get<any[]>(`/comments/article/${articleId}`);
};

// 创建评论
export const createArticleComment = (data: {
  content: string
  author: string
  articleId: number
  parentId?: number | null
}) => {
  return request.post<any>(`/comments`, data)
};

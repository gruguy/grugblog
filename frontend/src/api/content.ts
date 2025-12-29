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
export const getArticles = (
  params?: ArticleListParams
): Promise<ArticleListResponse> => {
  return request.get<ArticleListResponse>("/articles", { params });
};

// 获取文章详情
export const getArticleById = (id: number): Promise<Article> => {
  return request.get<Article>(`/articles/${id}`);
};

// 获取音乐列表
export const getMusicList = (): Promise<Music[]> => {
  return request.get<Music[]>("/music");
};

// 获取图片列表
export const getImageList = (params?: {
  categoryId?: number;
}): Promise<Image[]> => {
  return request.get<Image[]>("/images", { params });
};

// 获取视频列表
export const getVideoList = (): Promise<Video[]> => {
  return request.get<Video[]>("/videos");
};

// 获取文章活动数据
export const getActivityData = (
  year?: number
): Promise<
  Array<{
    date: string;
    count: number;
    description: string;
  }>
> => {
  return request.get<
    Array<{
      date: string;
      count: number;
      description: string;
    }>
  >("/articles/activity", { params: year ? { year } : {} });
};

// 获取文章分类列表
export const getCategories = (): Promise<
  Array<{
    id: number;
    name: string;
    description?: string;
  }>
> => {
  return request.get<
    Array<{
      id: number;
      name: string;
      description?: string;
    }>
  >("/articles/categories");
};

// 切换点赞状态
export const toggleArticleLike = (
  articleId: number
): Promise<{
  isLiked: boolean;
  likes: number;
}> => {
  return request.post<{
    isLiked: boolean;
    likes: number;
  }>(`/articles/${articleId}/like`);
};

// 检查点赞状态
export const checkArticleLikeStatus = (
  articleId: number
): Promise<{
  isLiked: boolean;
}> => {
  return request.get<{
    isLiked: boolean;
  }>(`/articles/${articleId}/like/status`);
};

// 切换收藏状态
export const toggleArticleCollect = (
  articleId: number
): Promise<{
  isCollected: boolean;
}> => {
  return request.post<{
    isCollected: boolean;
  }>(`/articles/${articleId}/collect`);
};

// 检查收藏状态
export const checkArticleCollectStatus = (
  articleId: number
): Promise<{
  isCollected: boolean;
}> => {
  return request.get<{
    isCollected: boolean;
  }>(`/articles/${articleId}/collect/status`);
};

// 获取文章评论列表
export const getArticleComments = (articleId: number): Promise<any[]> => {
  return request.get<any[]>(`/comments/article/${articleId}`);
};

// 创建评论
export const createArticleComment = (data: {
  content: string;
  author: string;
  articleId: number;
  parentId?: number | null;
}): Promise<any> => {
  return request.post<any>(`/comments`, data);
};

// 保存文章草稿
export const saveArticleDraft = (data: {
  title: string;
  content: string;
  categoryId?: number;
  tags?: string[];
  status?: "draft";
}): Promise<{
  id: number;
  title: string;
  content: string;
  status: "draft";
  updatedAt: string;
}> => {
  return request.post<{
    id: number;
    title: string;
    content: string;
    status: "draft";
    updatedAt: string;
  }>(`/articles/draft`, data);
};

// 发表文章
export const publishArticle = (data: {
  title: string;
  content: string;
  categoryId?: number;
  tags?: string[];
  status?: "published";
}): Promise<{
  id: number;
  title: string;
  content: string;
  status: "published";
  createdAt: string;
  updatedAt: string;
}> => {
  return request.post<{
    id: number;
    title: string;
    content: string;
    status: "published";
    createdAt: string;
    updatedAt: string;
  }>(`/articles`, data);
};

// 获取用户草稿列表
export const getUserDrafts = (): Promise<
  Array<{
    id: number;
    title: string;
    content: string;
    status: "draft";
    updatedAt: string;
  }>
> => {
  return request.get<
    Array<{
      id: number;
      title: string;
      content: string;
      status: "draft";
      updatedAt: string;
    }>
  >(`/articles/drafts`);
};

// 获取草稿详情
export const getDraftById = (
  id: number
): Promise<{
  id: number;
  title: string;
  content: string;
  categoryId?: number;
  tags?: string[];
  status: "draft";
  updatedAt: string;
}> => {
  return request.get<{
    id: number;
    title: string;
    content: string;
    categoryId?: number;
    tags?: string[];
    status: "draft";
    updatedAt: string;
  }>(`/articles/drafts/${id}`);
};

// 获取用户点赞的文章列表
export const getUserLikedArticles = (): Promise<Article[]> => {
  return request.get<Article[]>(`/articles/user/liked`);
};

// 获取用户收藏的文章列表
export const getUserCollectedArticles = (): Promise<Article[]> => {
  return request.get<Article[]>(`/articles/user/collected`);
};

// 更新用户信息
export const updateUserInfo = (data: {
  nickname?: string;
  bio?: string;
  avatar?: string;
}): Promise<any> => {
  return request.put<any>(`/auth/user`, data);
};

// 获取作者榜
export const getAuthorRanking = (): Promise<any[]> => {
  return request.get<any[]>(`/user/ranking`);
};

// 关注用户
export const followUser = (userId: number): Promise<any> => {
  return request.post<any>(`/user/follow/${userId}`);
};

// 取消关注
export const unfollowUser = (userId: number): Promise<any> => {
  return request.delete<any>(`/user/follow/${userId}`);
};

// 检查关注状态
export const checkFollowStatus = (userId: number): Promise<{ isFollowing: boolean }> => {
  return request.get<{ isFollowing: boolean }>(`/user/follow/${userId}/status`);
};

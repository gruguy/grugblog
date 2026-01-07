import service from './request.mjs';
import 'axios';
import 'pinia';
import 'vue';

const getArticles = (params) => {
  return service.get("/articles", {
    params
  });
};
const getArticleById = (id) => {
  return service.get(`/articles/${id}`);
};
const getMusicList = () => {
  return service.get("/music");
};
const getImageList = (params) => {
  return service.get("/images", { params });
};
const getVideoList = () => {
  return service.get("/videos");
};
const getActivityData = (year) => {
  return service.get("/articles/activity", { params: year ? { year } : {} });
};
const getCategories = () => {
  return service.get("/articles/categories");
};
const toggleArticleLike = (articleId) => {
  return service.post(`/articles/${articleId}/like`);
};
const checkArticleLikeStatus = (articleId) => {
  return service.get(`/articles/${articleId}/like/status`);
};
const toggleArticleCollect = (articleId) => {
  return service.post(`/articles/${articleId}/collect`);
};
const checkArticleCollectStatus = (articleId) => {
  return service.get(`/articles/${articleId}/collect/status`);
};
const getArticleComments = (articleId) => {
  return service.get(`/comments/article/${articleId}`);
};
const createArticleComment = (data) => {
  return service.post(`/comments`, data);
};
const toggleCommentLike = (commentId) => {
  return service.post(`/comments/${commentId}/like`);
};
const saveArticleDraft = (data) => {
  return service.post(`/articles/drafts`, data);
};
const publishArticle = (data) => {
  return service.post(`/articles`, data);
};
const getUserDrafts = () => {
  return service.get(`/articles/drafts`);
};
const getDraftById = (id) => {
  return service.get(`/articles/drafts/${id}`);
};
const getUserLikedArticles = () => {
  return service.get("/articles/user/liked");
};
const getUserCollectedArticles = () => {
  return service.get("/articles/user/collected");
};
const updateUserInfo = (data) => {
  return service.put("/user/info", data);
};
const getAuthorRanking = () => {
  return service.get("/user/ranking");
};
const followUser = (userId) => {
  return service.post(`/user/follow/${userId}`);
};
const unfollowUser = (userId) => {
  return service.delete(`/user/follow/${userId}`);
};
const checkFollowStatus = (userId) => {
  return service.get(`/user/follow/${userId}/status`);
};
const getFollowedAuthors = () => {
  return service.get("/user/following");
};

export { checkArticleCollectStatus, checkArticleLikeStatus, checkFollowStatus, createArticleComment, followUser, getActivityData, getArticleById, getArticleComments, getArticles, getAuthorRanking, getCategories, getDraftById, getFollowedAuthors, getImageList, getMusicList, getUserCollectedArticles, getUserDrafts, getUserLikedArticles, getVideoList, publishArticle, saveArticleDraft, toggleArticleCollect, toggleArticleLike, toggleCommentLike, unfollowUser, updateUserInfo };
//# sourceMappingURL=content.mjs.map

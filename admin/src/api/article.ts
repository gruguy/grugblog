import request from "./request";

export interface ArticleForm {
  id?: number;
  title: string;
  categoryId: number;
  content: string;
  status?: string;
}

export interface CategoryForm {
  id?: number;
  name: string;
  description?: string;
}

export const createArticle = (data: ArticleForm) => {
  return request.post("/articles", data);
};

export const updateArticle = (id: number, data: ArticleForm) => {
  return request.patch(`/articles/${id}`, data);
};

export const getArticleById = (id: number) => {
  return request.get(`/articles/${id}`);
};

export const deleteArticle = (id: number) => {
  return request.delete(`/articles/${id}`);
};

export interface ArticleListItem {
  id: number;
  title: string;
  category: { id: number; name: string } | null;
  content: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface ArticleListResponse {
  list: ArticleListItem[];
  total: number;
  page: number;
  size: number;
}

export const getArticleList = (params?: any): Promise<ArticleListResponse> => {
  return request.get("/articles", { params });
};

export const updateArticleStatus = (id: number, status: string) => {
  return request.patch(`/articles/${id}`, { status });
};

// 分类相关API
export const getCategories = () => {
  return request.get("/articles/categories");
};

export const createCategory = (data: CategoryForm) => {
  return request.post("/articles/categories", data);
};

export const updateCategory = (id: number, data: Partial<CategoryForm>) => {
  return request.patch(`/articles/categories/${id}`, data);
};

export const deleteCategory = (id: number) => {
  return request.delete(`/articles/categories/${id}`);
};

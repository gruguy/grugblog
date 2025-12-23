import request from "./request";

export interface ArticleForm {
  id?: number;
  title: string;
  categoryId: number;
  content: string;
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

export const getArticleList = (params?: any) => {
  return request.get("/articles", { params });
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

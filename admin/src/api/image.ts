import request from "./request";

export interface ImageForm {
  id?: number;
  title: string;
  description?: string;
  url: string;
  width: number;
  height: number;
  viewCount: number;
}

export const getImageList = (params?: any) => {
  return request.get("/images", { params });
};

export const getImageById = (id: number) => {
  return request.get(`/images/${id}`);
};

export const createImage = (data: FormData) => {
  return request.post("/images", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const updateImage = (id: number, data: FormData) => {
  return request.patch(`/images/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const deleteImage = (id: number) => {
  return request.delete(`/images/${id}`);
};

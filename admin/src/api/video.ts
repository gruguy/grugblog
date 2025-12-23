import request from "./request";

export interface VideoForm {
  id?: number;
  title: string;
  description?: string;
  url: string;
  cover: string;
  duration: number;
  viewCount: number;
}

export const getVideoList = (params?: any) => {
  return request.get("/videos", { params });
};

export const getVideoById = (id: number) => {
  return request.get(`/videos/${id}`);
};

export const createVideo = (data: FormData) => {
  return request.post("/videos", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const updateVideo = (id: number, data: FormData) => {
  return request.patch(`/videos/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const deleteVideo = (id: number) => {
  return request.delete(`/videos/${id}`);
};

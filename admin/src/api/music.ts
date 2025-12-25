import request from "./request";

export interface MusicForm {
  id?: number;
  name: string;
  artist: string;
  cover: string;
  url: string;
  duration: number;
  description?: string;
}

export const getMusicList = (params?: any) => {
  return request.get("/music", { params });
};

export const getMusicById = (id: number) => {
  return request.get(`/music/${id}`);
};

export const createMusic = (data: FormData) => {
  return request.post("/music", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateMusic = (id: number, data: FormData) => {
  return request.patch(`/music/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteMusic = (id: number) => {
  return request.delete(`/music/${id}`);
};

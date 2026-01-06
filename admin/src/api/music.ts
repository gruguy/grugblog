import request from "./request";

export interface MusicForm {
  id?: number;
  name: string;
  artist: string;
  cover: string;
  url: string;
  duration: number;
  description?: string;
  scores?: string[];
}

export const getMusicList = (params?: any) => {
  return request.get("/music", { params });
};

export const getMusicById = (id: number) => {
  return request.get(`/music/${id}`);
};

export const createMusic = (data: MusicForm) => {
  return request.post("/music", data);
};

export const updateMusic = (id: number, data: MusicForm) => {
  return request.patch(`/music/${id}`, data);
};

export const deleteMusic = (id: number) => {
  return request.delete(`/music/${id}`);
};

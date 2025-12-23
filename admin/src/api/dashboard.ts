import request from "./request";

export interface DashboardStats {
  articleCount: number;
  musicCount: number;
  imageCount: number;
  videoCount: number;
}

export const getDashboardStats = () => {
  return request.get<DashboardStats>('/dashboard/stats');
};

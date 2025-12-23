import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ActivityData } from "@/types/activity";
import { getActivityData } from "@/api/content";

export const useActivityStore = defineStore("activity", () => {
  // 活动数据
  const activityData = ref<ActivityData[]>([]);
  // 是否正在加载
  const isLoading = ref(false);
  // 错误信息
  const error = ref<string | null>(null);

  // 获取活动数据
  const fetchActivityData = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // 使用真实API请求
      const res = await getActivityData();

      // 后端统一响应格式是 { code, message, data }，所以直接访问 res.data 获取活动数据
      const activityDataFromApi = res.data || [];

      // 生成过去一年的所有日期数据
      const today = new Date();
      const generatedData: ActivityData[] = [];

      // 创建日期到活动数据的映射
      const activityMap = new Map<string, number>();
      activityDataFromApi.forEach((item) => {
        activityMap.set(item.date, item.count);
      });

      // 生成过去一年的所有日期数据
      for (let i = 365; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const formattedDate = date.toISOString().split("T")[0];
        const count = activityMap.get(formattedDate) || 0;

        generatedData.push({
          date: formattedDate,
          count,
          description: count > 0 ? `${count} 篇文章` : "无文章",
        });
      }

      activityData.value = generatedData;
      return activityData.value;
    } catch (err: any) {
      error.value = err.message || "获取活动数据失败";
      console.error("获取活动数据失败:", err);
      return activityData.value;
    } finally {
      isLoading.value = false;
    }
  };

  // 根据日期获取活动数据
  const getActivityByDate = (date: string) => {
    return activityData.value.find((item) => item.date === date);
  };

  // 获取总活动数
  const totalActivityCount = computed(() => {
    return activityData.value.reduce((sum, item) => sum + item.count, 0);
  });

  return {
    activityData,
    isLoading,
    error,
    fetchActivityData,
    getActivityByDate,
    totalActivityCount,
  };
});

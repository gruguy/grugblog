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
  // 签到状态
  const checkInStatus = ref<Record<string, boolean>>({});

  // 辅助函数：格式化日期为 YYYY-MM-DD 格式（使用本地时区）
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 获取活动数据
  const fetchActivityData = async (year?: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      // 使用真实API请求
      let activityDataFromApi: Array<{
        date: string;
        count: number;
        description?: string;
      }> = [];
      try {
        // 从API获取数据
        const apiResponse = await getActivityData(year);

        // 处理API响应，确保获取的是数组数据
        // 如果apiResponse是对象且包含data字段，说明是完整响应格式
        if (
          typeof apiResponse === "object" &&
          apiResponse !== null &&
          "data" in apiResponse
        ) {
          // 直接从data字段获取活动数据数组
          activityDataFromApi = Array.isArray(apiResponse.data)
            ? apiResponse.data
            : [];
        } else {
          // 否则，直接检查是否是数组（响应拦截器处理过的情况）
          activityDataFromApi = Array.isArray(apiResponse) ? apiResponse : [];
        }
      } catch (err) {
        console.log("获取真实活动数据失败，使用模拟数据");
        // 如果API请求失败，生成模拟数据
        const targetYear = year || new Date().getFullYear();
        for (let month = 0; month < 12; month++) {
          for (let day = 1; day <= 28; day++) {
            activityDataFromApi.push({
              date: `${targetYear}-${(month + 1)
                .toString()
                .padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
              count: Math.floor(Math.random() * 10),
              description: "模拟活动数据",
            });
          }
        }
      }

      // 生成指定年份的所有日期数据
      const today = new Date();
      const targetYear = year || today.getFullYear();
      const generatedData: ActivityData[] = [];

      // 创建日期到活动数据的映射，只保留指定年份的数据
      const activityMap = new Map<string, number>();
      activityDataFromApi.forEach((item: { date: string; count: number }) => {
        if (item.date.startsWith(`${targetYear}-`)) {
          activityMap.set(item.date, item.count);
        }
      });

      // 生成指定年份的所有日期数据
      const startDate = new Date(targetYear, 0, 1); // 当年1月1日
      const endDate = new Date(targetYear, 11, 31); // 当年12月31日
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      for (let i = 0; i <= diffDays; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const formattedDate = formatDate(date);
        const count = activityMap.get(formattedDate) || 0;
        const isCheckedIn = checkInStatus.value[formattedDate] || false;

        generatedData.push({
          date: formattedDate,
          count: isCheckedIn ? count + 1 : count,
          description: isCheckedIn ? "已签到" : (count > 0 ? `${count} 条内容` : "无内容"),
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

  // 签到功能
  const checkIn = async () => {
    const today = formatDate(new Date());
    
    // 如果今天已经签到，直接返回
    if (checkInStatus.value[today]) {
      return true;
    }

    try {
      isLoading.value = true;
      // 这里可以添加真实的签到API调用
      // await checkInApi();
      
      // 模拟签到成功
      checkInStatus.value[today] = true;
      
      // 更新活动数据
      await fetchActivityData();
      return true;
    } catch (err: any) {
      error.value = err.message || "签到失败";
      console.error("签到失败:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 检查是否已签到
  const isCheckedInToday = computed(() => {
    const today = formatDate(new Date());
    return checkInStatus.value[today] || false;
  });

  // 获取签到状态
  const getCheckInStatus = (date: string) => {
    return checkInStatus.value[date] || false;
  };

  return {
    activityData,
    isLoading,
    error,
    checkInStatus,
    fetchActivityData,
    getActivityByDate,
    totalActivityCount,
    checkIn,
    isCheckedInToday,
    getCheckInStatus,
  };
});

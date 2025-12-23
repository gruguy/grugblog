<template>
  <div class="activity-calendar-container">
    <div class="calendar-header">
      <h3 class="title">{{ title || "活动日历" }}</h3>
      <!-- 删除右上角的年份切换按钮 -->
    </div>
    <div class="calendar-layout">
      <!-- 年份选择侧边栏 - 按正序排列年份 -->
      <div class="year-sidebar">
        <!-- 直接使用years数组，确保年份从早到晚显示 -->
        <div 
          v-for="year in years" 
          :key="year"
          class="year-item"
          :class="{ 'active': year === currentYear }"
          @click="selectYear(year)"
        >
          {{ year }}
        </div>
      </div>
      
      <!-- 日历主体 -->
      <div class="calendar-wrapper">
        <div class="activity-calendar-inner">
          <VueActivityCalendar
            :key="currentYear"
            :data="filteredCalendarData"
            :theme="theme"
            :show-month="showMonth"
            :show-legend="showLegend"
            :start-date="yearStartDate"
            :end-date="yearEndDate"
            :width="44"
            :height="7"
             :colors='["#eff2f5","#9be9a8","#40c463","#30a14e","#216e39",]'
            :tooltip="true"
            @click="handleDateClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ActivityCalendar as VueActivityCalendar } from "vue-activity-calendar";
import type { ActivityData } from "@/types/activity";

const props = defineProps<{
  /** 活动数据 */
  data: ActivityData[];
  /** 标题 */
  title?: string;
  /** 是否显示图例 */
  showLegend?: boolean;
  /** 是否显示月份 */
  showMonth?: boolean;
  /** 是否显示星期 */
  showWeek?: boolean;
}>();

const emit = defineEmits<{
  /** 点击日期事件 */
  (e: "click", date: string, data: ActivityData | undefined): void;
}>();

// 当前年份
const currentYear = ref(new Date().getFullYear());
// 生成最近5年，按正序排列（从早到晚：2021, 2022, 2023, 2024, 2025）
const currentDate = new Date();
const currentYearValue = currentDate.getFullYear();
// 生成从当前年份的前4年到当前年份的数组，确保顺序是[2021, 2022, 2023, 2024, 2025]
const years = ref<number[]>([
  currentYearValue - 4,
  currentYearValue - 3,
  currentYearValue - 2,
  currentYearValue - 1,
  currentYearValue
]);

// 计算当前年份的开始日期
const yearStartDate = computed(() => {
  return `${currentYear.value}-01-01`;
});

// 计算当前年份的结束日期，确保只显示当前年份的12个月
const yearEndDate = computed(() => {
  return `${currentYear.value}-12-31`;
});

// 将活动数据转换为日期到计数的映射，提高过滤效率
const activityMap = computed(() => {
  const map = new Map<string, ActivityData>();
  props.data.forEach(item => {
    map.set(item.date, item);
  });
  return map;
});

// 年份选择
const selectYear = (year: number) => {
  currentYear.value = year;
};

// 根据当前年份过滤活动数据
const filteredCalendarData = computed(() => {
  const year = currentYear.value;
  return props.data.filter(item => {
    // 只返回当前年份的数据
    return item.date.startsWith(`${year}-`);
  }).map(item => ({
    ...item,
    // 确保每个数据项都有日期和描述
    date: item.date,
    // 格式化日期显示，例如：2025-01-01 星期三
    description: `${item.date} ${new Date(item.date).toLocaleDateString('zh-CN', { weekday: 'long' })}${item.count > 0 ? ` - ${item.count} 篇文章` : ' - 无文章'}`
  }));
});

// 主题配置 - GitHub风格，加深背景色
const theme = ref({
  // 颜色配置，根据count值自动分配颜色，与GitHub一致，加深背景色
  colors: {
    0: "#d0d7de", // 加深默认背景色，避免太淡
    1: "#9be9a8",
    2: "#40c463",
    3: "#30a14e",
    4: "#216e39",
  },
  // 文字颜色
  text: {
    primary: "#24292f",
    secondary: "#656d76",
  },
  // 提示框样式
  tooltip: {
    backgroundColor: "#24292f",
    textColor: "#f6f8fa",
  },
});

// 处理日期点击事件
const handleDateClick = (...args: any[]) => {
  // 调试：打印所有参数，了解其结构
  console.log('handleDateClick args:', args);
  
  // 尝试从参数中获取日期
  let date: string | undefined;
  
  // 情况1：第一个参数是日期字符串
  if (typeof args[0] === 'string') {
    date = args[0];
  }
  // 情况2：参数是一个对象，尝试从对象中获取日期
  else if (args[0] && typeof args[0] === 'object') {
    // 检查是否有date属性
    if (args[0].date) {
      date = args[0].date;
    }
    // 检查是否有detail属性
    else if (args[0].detail) {
      date = args[0].detail;
    }
    // 检查是否是PointerEvent，尝试从target获取更多信息
    else if (args[0].target) {
      // 尝试获取元素的textContent或其他属性
      console.log('Event target:', args[0].target);
      console.log('Event target className:', args[0].target.className);
      console.log('Event target parentElement:', args[0].target.parentElement);
    }
  }
  
  // 情况3：检查第二个参数
  if (!date && args.length > 1) {
    if (typeof args[1] === 'string') {
      date = args[1];
    }
  }
  
  // 如果成功获取到日期，触发点击事件
  if (date) {
    const data = props.data.find((item) => item.date === date);
    emit("click", date, data);
  }
};
</script>

<style scoped>
.activity-calendar-container {
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: #24292f;
}

.calendar-layout {
  display: flex;
  gap: 1rem;
}

.year-sidebar {
  min-width: 60px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.year-item {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  text-align: center;
  transition: all 0.2s;
  background-color: #f6f8fa;
  color: #24292f;
}

.year-item:hover {
  background-color: #f3f4f6;
}

/* 选中年份颜色改为蓝色 */
.year-item.active {
  background-color: #0969da;
  color: white;
  font-weight: 600;
}

.calendar-wrapper {
  flex: 1;
  overflow: hidden;
}

.activity-calendar-inner {
  width: 100%;
  min-height: 120px;
}
</style>

<style>
/* 全局样式，确保日历组件样式正确 - GitHub风格 */
.activityCalendar {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  display: flex;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.activityCalendar .left {
  margin-right: 15px;
  flex-shrink: 0;
  min-width: 30px;
}

.activityCalendar .right {
  flex: 1;
  overflow: visible;
}

.activityCalendar .header {
  display: flex;
  margin-bottom: 15px;
  position: relative;
  height: 16px;
}

.activityCalendar .header div {
  position: absolute;
  font-size: 11px;
  color: #656d76;
  transform: translateX(-50%);
  white-space: nowrap;
}

/* 确保显示完整的12个月 */
.activityCalendar .content {
  display: grid;
  /* 53列（52周 + 1），确保显示完整的12个月 */
  grid-template-columns: repeat(53, 13px);
  /* 7行（每周一行） */
  grid-template-rows: repeat(7, 13px);
  /* 减小间距，与GitHub一致 */
  gap: 2px;
  margin-bottom: 8px;
}

/* 确保每一格为正方形 */
.activityCalendar .item {
  /* 正方形单元格 */
  width: 11px;
  height: 11px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  /* 确保是正方形 */
  aspect-ratio: 1 / 1;
}

.activityCalendar .item:hover {
  transform: scale(1.3);
  border-radius: 3px;
}

.activityCalendar .levelFlagContent {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: #656d76;
  margin-top: 8px;
}

.activityCalendar .levelFlag {
  display: flex;
  gap: 2px;
  align-items: center;
}

/* 确保图例也是正方形 */
.activityCalendar .levelFlag div {
  /* 正方形单元格 */
  width: 11px;
  height: 11px;
  border-radius: 3px;
  /* 确保是正方形 */
  aspect-ratio: 1 / 1;
}
</style>
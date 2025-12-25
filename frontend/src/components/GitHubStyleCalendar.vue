<template>
  <div class="github-style-calendar">
    <div class="calendar-header">
      <h3 class="title">{{ title || "Activity Calendar" }}</h3>
    </div>

    <div class="calendar-main">
      <!-- 年份导航 -->
      <div class="year-nav">
        <div
          v-for="year in years"
          :key="year"
          class="year-item"
          :class="{ active: year === currentYear }"
          @click="selectYear(year)"
        >
          {{ year }}
        </div>
      </div>

      <!-- 日历表格 -->
      <div class="calendar-container">
        <table class="calendar-table">
          <!-- 月份标题行 -->
          <thead>
            <tr class="month-row">
              <th class="weekday-header"></th>
              <th
                v-for="(monthCell, index) in monthCells"
                :key="index"
                class="month-header"
                :colspan="monthCell.days"
              >
                {{ monthCell.month }}
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- 按周几行 -->
            <tr
              v-for="(weekdayDays, weekdayIndex) in calendarByWeekday"
              :key="weekdayIndex"
            >
              <!-- 周几标题 -->
              <td class="weekday-cell">{{ weekdays[weekdayIndex] }}</td>
              <!-- 日期格子 -->
              <td
                v-for="(day, dayIndex) in weekdayDays"
                :key="dayIndex"
                class="calendar-day-cell"
                :class="getDayClass(day)"
                :title="day.tooltip"
                @click="handleDayClick(day)"
                @mouseenter="showTooltip(day, $event)"
                @mouseleave="hideTooltip"
              ></td>
            </tr>
          </tbody>
        </table>

        <!-- 图例 -->
        <div class="calendar-legend">
          <div class="legend-text">Less</div>
          <div class="legend-colors">
            <div
              class="legend-color"
              v-for="color in legendColors"
              :key="color"
              :style="{ backgroundColor: color }"
            ></div>
          </div>
          <div class="legend-text">More</div>
        </div>
      </div>
    </div>

    <!-- 悬停提示 -->
    <div v-if="tooltipVisible" class="calendar-tooltip" :style="tooltipStyle">
      {{ tooltipContent }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// 类型定义
type ActivityData = {
  date: string;
  count: number;
  description?: string;
};

// Props
const props = defineProps<{
  data: ActivityData[];
  title?: string;
  showLegend?: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: "click", date: string, data: ActivityData | undefined): void;
  (e: "yearChange", year: number): void;
}>();

// 响应式数据
const currentYear = ref(new Date().getFullYear());
const tooltipVisible = ref(false);
const tooltipContent = ref("");
const tooltipStyle = ref({ top: "0px", left: "0px" });

// 计算属性：年份列表
const years = computed(() => {
  const current = new Date().getFullYear();
  return [current - 4, current - 3, current - 2, current - 1, current];
});

// 星期标题
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// 图例颜色
const legendColors = ["#d0d7de", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

// 计算属性：总贡献数
const totalContributions = computed(() => {
  return props.data.reduce((sum, item) => sum + item.count, 0);
});

// 计算属性：按年份过滤的数据
const filteredData = computed(() => {
  return new Map(
    props.data
      .filter((item) => item.date.startsWith(`${currentYear.value}-`))
      .map((item) => [item.date, item])
  );
});

// 计算属性：月份单元格（用于设置colspan）
const monthCells = computed(() => {
  const months = [];
  const allDays = calendarDays.value;
  const totalWeeks = Math.ceil(allDays.length / 7);

  // 1. 统计每个周中各个月份的日期数量
  const weekMonthCounts = Array.from({ length: totalWeeks }, () => new Map());

  allDays.forEach((day, index) => {
    if (day.isCurrentYear) {
      const weekIndex = Math.floor(index / 7);
      const monthCount = weekMonthCounts[weekIndex].get(day.month) || 0;
      weekMonthCounts[weekIndex].set(day.month, monthCount + 1);
    }
  });

  // 2. 为每个周分配归属月份（日期数量最多的月份，相同数量则选择上一个月）
  const weekOwnership = new Array(totalWeeks).fill(-1);

  weekMonthCounts.forEach((monthCounts, weekIndex) => {
    let maxCount = 0;
    let owningMonth = -1;

    // 检查是否有月份在该周有日期
    if (monthCounts.size > 0) {
      // 遍历所有月份，找出日期数量最多的月份
      for (let month = 0; month < 12; month++) {
        const count = monthCounts.get(month) || 0;
        if (count > maxCount || (count === maxCount && owningMonth === -1)) {
          maxCount = count;
          owningMonth = month;
        }
      }
    }

    weekOwnership[weekIndex] = owningMonth;
  });

  // 3. 计算每个月的colspan值
  const monthColspan = new Array(12).fill(0);

  weekOwnership.forEach((owningMonth) => {
    if (owningMonth !== -1) {
      monthColspan[owningMonth]++;
    }
  });

  // 4. 生成月份单元格数据
  for (let month = 0; month < 12; month++) {
    const monthName = new Date(0, month).toLocaleDateString("en-US", {
      month: "short",
    });

    months.push({
      month: monthName,
      days: monthColspan[month],
    });
  }

  return months;
});

// 计算属性：日历天数
const calendarDays = computed(() => {
  const days = [];
  const startDate = new Date(currentYear.value, 0, 1);
  const endDate = new Date(currentYear.value, 11, 31);

  // 计算第一周的起始日期（调整到周一）
  const firstDayOfYear = new Date(currentYear.value, 0, 1);
  const startOfCalendar = new Date(firstDayOfYear);
  startOfCalendar.setDate(
    firstDayOfYear.getDate() -
      firstDayOfYear.getDay() +
      (firstDayOfYear.getDay() === 0 ? -6 : 1)
  );

  // 生成366 + 额外周的天数
  let currentDay = new Date(startOfCalendar);

  // 计算结束日期：当前年份的12月31日 + 足够的天数来完成最后一周
  const endOfCalendar = new Date(endDate);
  endOfCalendar.setDate(endOfCalendar.getDate() + (6 - endOfCalendar.getDay()));

  while (currentDay <= endOfCalendar) {
    const dateStr = currentDay.toISOString().split("T")[0];
    const data = filteredData.value.get(dateStr);

    // 获取月份（0-11）和周几（0-6，0是周日）
    const month = currentDay.getMonth();
    // 将周几转换为周一到周日（0-6，0是周一）
    let dayOfWeek = currentDay.getDay();
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    days.push({
      date: dateStr,
      count: data?.count || 0,
      tooltip: generateTooltip(data, currentDay),
      isCurrentYear: currentDay.getFullYear() === currentYear.value,
      month: month, // 月份索引（0-11）
      dayOfWeek: dayOfWeek, // 周几索引（0-6，0是周一）
      actualDate: new Date(currentDay), // 实际日期对象
    });

    currentDay.setDate(currentDay.getDate() + 1);
  }

  return days;
});

// 计算属性：按周几分组的日历数据
const calendarByWeekday = computed(() => {
  const data = calendarDays.value;
  // 创建7个数组，分别对应周一到周日
  const weekdayArrays = Array.from({ length: 7 }, () => []);

  // 将日期按周几分配到对应的数组
  data.forEach((day) => {
    weekdayArrays[day.dayOfWeek].push(day);
  });

  return weekdayArrays;
});

// 计算属性：按周分组的日历数据（保留原功能，可能后续删除）
const calendarWeeks = computed(() => {
  const weeks = [];
  const days = calendarDays.value;

  // 将所有日期按7天一组分组
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
});

// 生成tooltip内容
const generateTooltip = (data: ActivityData | undefined, date: Date) => {
  const count = data?.count || 0;
  const dateStr = date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `${dateStr}：${count}次贡献`;
};

// 获取日期单元格的类名
const getDayClass = (day: any) => {
  const count = day.count;
  let level = 0;

  if (count > 0) level = 1;
  if (count > 3) level = 2;
  if (count > 6) level = 3;
  if (count > 9) level = 4;

  return `level-${level}${!day.isCurrentYear ? " other-year" : ""}`;
};

// 年份选择
const selectYear = (year: number) => {
  currentYear.value = year;
  emit("yearChange", year);
};

// 显示tooltip
const showTooltip = (day: any, event: MouseEvent) => {
  tooltipContent.value = day.tooltip;
  tooltipVisible.value = true;

  // 设置tooltip位置
  tooltipStyle.value = {
    top: `${event.pageY - 40}px`,
    left: `${event.pageX + 10}px`,
  };
};

// 隐藏tooltip
const hideTooltip = () => {
  tooltipVisible.value = false;
};

// 处理日期点击
const handleDayClick = (day: any) => {
  const data = filteredData.value.get(day.date);
  emit("click", day.date, data || undefined);
};
</script>

<style scoped>
.github-style-calendar {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #24292f;
  margin: 0;
}

.contribution-count {
  font-size: 14px;
  color: #656d76;
}

.calendar-main {
  display: flex;
  gap: 20px;
}

.year-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 50px;
}

.year-item {
  padding: 5px 10px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  color: #24292f;
  background-color: #f6f8fa;
  transition: all 0.2s;
}

.year-item:hover {
  background-color: #f3f4f6;
}

.year-item.active {
  background-color: #0969da;
  color: white;
  font-weight: 600;
}

.calendar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.calendar-table {
  border-spacing: 3px;
  width: 100%;
  border-collapse: separate;
}

.month-row {
  margin-bottom: 8px;
  height: auto;
  line-height: 1;
}

.calendar-table tbody tr {
  /* 移除固定高度，让行高由单元格内容决定 */
}

.weekday-header {
  width: 20px;
  height: 12px;
  padding: 0;
  margin: 0;
}

.month-header {
  font-size: 11px;
  color: #656d76;
  text-align: center;
  font-weight: 600;
  padding: 0;
  margin: 0;
  width: auto;
}

.weekday-cell {
  width: 20px;
  font-size: 11px;
  color: #656d76;
  text-align: right;
  padding: 0 5px;
  margin: 0;
  line-height: 1;
  vertical-align: top;
  /* 确保周几单元格不会影响行高 */
  height: auto;
}

.calendar-day-cell {
  padding: 0;
  width: calc(100% / 53); /* 大致计算每周宽度，确保能显示全年的天数 */
  aspect-ratio: 1/1; /* 确保单元格永远是正方形 */
  border-radius: 2px;
  transition: transform 0.1s;
  /* 确保单元格内容不会影响尺寸 */
  line-height: 1;
}

.calendar-day-cell:hover {
  transform: scale(1.5);
}

/* 贡献等级颜色 */
.level-0 {
  background-color: rgba(208, 215, 222, 0.5);
}
.level-1 {
  background-color: #9be9a8;
}
.level-2 {
  background-color: #40c463;
}
.level-3 {
  background-color: #30a14e;
}
.level-4 {
  background-color: #216e39;
}

.other-year {
  opacity: 0.3;
}

.calendar-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 0 20px;
}

.legend-text {
  font-size: 11px;
  color: #656d76;
}

.legend-colors {
  display: flex;
  gap: 2px;
}

.legend-color {
  width: 11px;
  height: 11px;
  border-radius: 2px;
}

.calendar-tooltip {
  position: absolute;
  background-color: #24292f;
  color: #f6f8fa;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style>

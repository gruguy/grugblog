export interface ActivityData {
  /** 日期，格式为YYYY-MM-DD */
  date: string;
  /** 活动数量，用于决定颜色深浅 */
  count: number;
  /** 可选的活动描述 */
  description?: string;
}

export interface ActivityCalendarProps {
  /** 活动数据列表 */
  data: ActivityData[];
  /** 日历标题 */
  title?: string;
  /** 是否显示颜色图例 */
  showLegend?: boolean;
  /** 是否显示月份 */
  showMonth?: boolean;
  /** 是否显示星期 */
  showWeek?: boolean;
  /** 点击日期时的回调 */
  onDateClick?: (date: string, data: ActivityData | undefined) => void;
}

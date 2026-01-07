declare module "vue-activity-calendar" {
  import type { DefineComponent } from "vue";

  export interface ActivityCalendarProps {
    data: Array<{
      date: string;
      count: number;
      description?: string;
    }>;
    endDate?: string;
    width?: number;
    height?: number;
    cellLength?: number;
    cellInterval?: number;
    cellBorderRadius?: number;
    header?: string[];
    backgroundColor?: string;
    colors?: string[];
    weekDayFlagText?: string[];
    levelFlagText?: string[];
    fontSize?: number;
    fontColor?: string;
    showHeader?: boolean;
    showWeekDayFlag?: boolean;
    showLevelFlag?: boolean;
    levelMapper?: (count: number) => number;
    clickEvent?: (data: any) => void;
    theme?: {
      colors?: {
        [key: number]: string;
      };
      text?: {
        primary?: string;
        secondary?: string;
      };
      tooltip?: {
        backgroundColor?: string;
        textColor?: string;
      };
    };
    showMonth?: boolean;
    showWeek?: boolean;
    showLegend?: boolean;
  }

  export const ActivityCalendar: DefineComponent<ActivityCalendarProps>;
  export default function install(app: any): void;
}

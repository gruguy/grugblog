import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

export const formatDate = (date: string | Date): string => {
  if (!date) return "";
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};

export const formatDateFromNow = (date: string | Date): string => {
  if (!date) return "";
  return dayjs(date).fromNow();
};

import dayjs from "dayjs";

export const formatDateAndTime = (date: string) => {
  return dayjs(date).format("DD MMM YYYY, h:mm A");
}
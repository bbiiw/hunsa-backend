import moment from "moment-timezone";

export const getCurrentTime = (): string => {
  return moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
};

export const getGMT7 = (date: Date): string => {
  return moment(date).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
};

export const getDate = (date: Date): string => {
  return moment(date, "YYYY-MM-DD").tz("Asia/Bangkok").format("YYYY-MM-DD");
};

export const getHour = (time: Date): string => {
  return moment(time, "HH:mm:ss").tz("Asia/Bangkok").format("HH:mm:ss");
};

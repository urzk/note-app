export const to2digits = (num: number) => {
  return String(num).padStart(2, "0");
};

export const getDate = (dateTime: Date) => {
  return (
    String(dateTime.getFullYear()) +
    "/" +
    to2digits(dateTime.getMonth() + 1) +
    "/" +
    to2digits(dateTime.getDate())
  );
};

export const getTime = (dateTime: Date) => {
  return (
    to2digits(dateTime.getHours()) + ":" + to2digits(dateTime.getMinutes())
  );
};

export const getDateOrTime = (dateTimeNumber: number) => {
  const dateTime = new Date(dateTimeNumber);
  const date = getDate(dateTime);
  const dateNow = getDate(new Date());
  if (date != dateNow) {
    return date;
  }
  return getTime(dateTime);
};

export const numberToDate = (dateNumber: number | string | undefined) => {
  if (typeof dateNumber === "number") {
    return new Date(dateNumber);
  } else if (typeof dateNumber === "string") {
    return new Date(Number(dateNumber));
  } else {
    return undefined;
  }
};

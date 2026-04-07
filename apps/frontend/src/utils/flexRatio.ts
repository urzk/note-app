const flexRatios = [
  "hidden",
  "flex-1/12",
  "flex-2/12",
  "flex-3/12",
  "flex-4/12",
  "flex-5/12",
  "flex-6/12",
  "flex-7/12",
  "flex-8/12",
  "flex-9/12",
  "flex-10/12",
  "flex-11/12",
  "flex-1",
];

export const flexRatio = (n: number) => {
  if (0 <= n && n < flexRatios.length) return flexRatios[n];
  else return "";
};

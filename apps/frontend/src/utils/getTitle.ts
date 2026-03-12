export const getTitle = (text: string) => {
  const end = text.indexOf("\n");
  const line = end === -1 ? text : text.slice(0, end);
  let i = 0;
  while (i < line.length && (line[i] === " " || line[i] === "#")) {
    i++;
  }
  return line.slice(i, i + 255); // VARCHAR(255) of MySQL
};

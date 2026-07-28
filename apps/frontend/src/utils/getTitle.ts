import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import { toString } from "mdast-util-to-string";

import { memoize } from "lodash";

const parser = unified().use(remarkParse).use(remarkGfm).use(remarkMath);

const getMemoizedTitle = memoize((mdLine: string) => {
  const mdast = parser.parse(mdLine);
  console.log("title change!");
  return toString(mdast).slice(0, 255); // VARCHAR(255) of MySQL
});

export const getTitle = (content: string) => {
  const end = content.indexOf("\n");
  const mdLine = end === -1 ? content : content.slice(0, end);
  return getMemoizedTitle(mdLine);
};

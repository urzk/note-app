import type { RefObject } from "react";

import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import { toString } from "mdast-util-to-string";

const parser = unified().use(remarkParse).use(remarkGfm).use(remarkMath);

export const getTitle = (
  content: string,
  titleCacheRef: RefObject<{ md: string; title: string } | null>,
) => {
  const end = content.indexOf("\n");
  const mdLine = end === -1 ? content : content.slice(0, end);

  if (mdLine === titleCacheRef.current?.md) {
    return titleCacheRef.current.title;
  } else {
    const mdast = parser.parse(mdLine);
    const title = toString(mdast).slice(0, 255); // VARCHAR(255) of MySQL
    titleCacheRef.current = { md: mdLine, title };
    return title;
  }
};

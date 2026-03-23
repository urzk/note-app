import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import { removePosition } from "unist-util-remove-position";

import type { Request, Response } from "../types/mdToHastSession";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex);

onmessage = async (e: MessageEvent<Request>) => {
  const { sessionId, md } = e.data;
  const mdast = processor.parse(md);
  removePosition(mdast);
  const hast = await processor.run(mdast);
  const res: Response = { sessionId, hast };
  postMessage(res);
};
export {};

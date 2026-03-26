import { unified } from "unified";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeKaTeX from "rehype-katex";
import { removePosition } from "unist-util-remove-position";

import type { Request, Response } from "../types/mdToHastSession";

const processor = unified()
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkParse)
  .use(remarkBreaks)
  .use(remarkRehype)
  .use(rehypeKaTeX);

onmessage = async (e: MessageEvent<Request>) => {
  const { sessionId, md } = e.data;
  const mdast = processor.parse(md);
  removePosition(mdast);
  const hast = await processor.run(mdast);
  const res: Response = { sessionId, hast };
  postMessage(res);
};
export {};

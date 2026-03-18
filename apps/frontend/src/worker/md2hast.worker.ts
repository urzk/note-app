import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import { removePosition } from "unist-util-remove-position";

onmessage = async (e: MessageEvent<{ id: number; md: string }>) => {
  const { id, md } = e.data;
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex);
  const mdast = processor.parse(md);
  removePosition(mdast);
  const hast = await processor.run(mdast);
  postMessage({ id, hast });
};
export {};

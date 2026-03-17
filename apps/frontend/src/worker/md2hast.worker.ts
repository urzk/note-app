import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { removePosition } from "unist-util-remove-position";

onmessage = async (e: MessageEvent<{ id: number; md: string }>) => {
  const { id, md } = e.data;
  const processor = unified().use(remarkParse).use(remarkRehype);
  const mdast = processor.parse(md);
  removePosition(mdast);
  const hast = await processor.run(mdast);
  postMessage({ id, hast });
};
export {};

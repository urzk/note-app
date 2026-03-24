import production from "react/jsx-runtime";
import useSWR from "swr";

import { unified } from "unified";
import rehypeReact from "rehype-react";

import type { Response } from "../types/mdToHastSession";

const compiler = unified().use(rehypeReact, production);

export const MdPreview = () => {
  const { data } = useSWR<Response>("note-hast-cache", null);
  return (
    <div className="w-1/2 p-4 overflow-auto border-l border-zinc-800 prose dark:prose-invert prose-zinc">
      {data && compiler.stringify(data.hast)}
    </div>
  );
};

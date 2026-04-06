import production from "react/jsx-runtime";
import useSWR from "swr";

import { unified } from "unified";
import rehypeReact from "rehype-react";

import type { Response } from "../types/mdToHastSession";

const compiler = unified().use(rehypeReact, production);

export const MdPreview = () => {
  const { data } = useSWR<Response>("note-hast-cache", null);
  return (
    <div className="border-l flex-1 view-wrapper">
      <div className="p-4 preview-prose view">
        {data && compiler.stringify(data.hast)}
      </div>
    </div>
  );
};

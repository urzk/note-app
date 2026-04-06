import production from "react/jsx-runtime";
import useSWR from "swr";

import { unified } from "unified";
import rehypeReact from "rehype-react";

import type { Response } from "../types/mdToHastSession";
import { flexRatio } from "src/utils/flexRatio";

const compiler = unified().use(rehypeReact, production);

export const MdPreview = ({ ratio }: { ratio: number }) => {
  const wrapperClassName = flexRatio(ratio) + " view-wrapper";
  const { data } = useSWR<Response>("note-hast-cache", null);
  return (
    <div className={wrapperClassName}>
      <div className="p-4 preview-prose view">
        {data && compiler.stringify(data.hast)}
      </div>
    </div>
  );
};

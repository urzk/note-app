import production from "react/jsx-runtime";
import useSWR from "swr";

import { unified } from "unified";
import rehypeReact from "rehype-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

import type { Response } from "../types/mdToHastSession";

import { useSetAtom } from "jotai";
import { editorViewStateAtom } from "src/jotai/atoms";

const compiler = unified().use(rehypeReact, production);

export const MdPreview = () => {
  const { data } = useSWR<Response>("note-hast-cache", null);

  const setEditorViewState = useSetAtom(editorViewStateAtom);

  return (
    <div className="flex-1 view-wrapper">
      <div className="p-4 preview-prose view">
        {data && compiler.stringify(data.hast)}
      </div>
      <div
        className="absolute top-0 right-0 opacity-75"
        onClick={() => setEditorViewState("editor")}
      >
        <FontAwesomeIcon icon={faEye} />
      </div>
    </div>
  );
};

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import { useSetAtom } from "jotai";
import { editorViewStateAtom } from "src/jotai/atoms";

import { CodeMirror } from "./CodeMirror";

export const CodeMirrorWrapper = () => {
  const setEditorViewState = useSetAtom(editorViewStateAtom);

  return (
    <div className="flex-1 view-wrapper">
      <CodeMirror />
      <div
        className="absolute top-0 right-0 opacity-75"
        onClick={() => setEditorViewState("milkdown")}
      >
        <FontAwesomeIcon icon={faPen} />
      </div>
    </div>
  );
};

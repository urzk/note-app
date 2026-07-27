import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

import { useSetAtom } from "jotai";
import { editorViewStateAtom } from "src/jotai/atoms";

import { CrepeEditor } from "./CrepeEditor";

export const CrepeEditorWrapper = () => {
  const setEditorViewState = useSetAtom(editorViewStateAtom);

  return (
    <div className="flex-1 view-wrapper">
      <CrepeEditor />
      <div
        className="absolute top-0 right-0 opacity-75"
        onClick={() => setEditorViewState("editor")}
      >
        <FontAwesomeIcon icon={faEye} />
      </div>
    </div>
  );
};

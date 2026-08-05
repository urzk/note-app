import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

import { useAtomValue, useSetAtom } from "jotai";
import { editorViewStateAtom } from "src/jotai/atoms";
import {
  editorTextLengthAtom,
  editorTextSelectionLengthAtom,
} from "src/jotai/atoms";

import { CrepeEditor } from "./CrepeEditor";

export const CrepeEditorWrapper = () => {
  const setEditorViewState = useSetAtom(editorViewStateAtom);

  const textSelectionLength = useAtomValue(editorTextSelectionLengthAtom);
  const textLength = useAtomValue(editorTextLengthAtom);

  return (
    <div className="flex-1 view-wrapper">
      <CrepeEditor />
      <div
        className="absolute top-0 right-0 opacity-75"
        onClick={() => setEditorViewState("editor")}
      >
        <FontAwesomeIcon icon={faEye} />
      </div>
      <div className="absolute bottom-0 right-0 px-1">
        <small className="bg-zinc-900 opacity-75 text-sm">
          {textSelectionLength
            ? `選択中: ${textSelectionLength}文字`
            : `${textLength}文字`}
        </small>
      </div>
    </div>
  );
};

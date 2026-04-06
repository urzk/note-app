import { useMemo, useRef, useState } from "react";

import { TextAreaCommandOrchestrator, getCommands } from "@uiw/react-md-editor";

import { MdPreview } from "./MdPreview";
import { EditorTextArea } from "./EditorTextArea";
import { MdToolbar } from "./MdToolbar";
import { ViewToolbar } from "./ViewToolbar";

const flexDirections = [
  "flex-row",
  "flex-col-reverse",
  "flex-row-reverse",
  "flex-col",
];

export const Editor = () => {
  const [ratio, setRatio] = useState<number>(6); // 0 ~ 12
  const maxRatio = 12;
  const hasMdPreview = ratio !== 0;

  const [position, setPosition] = useState<number>(0); // 0 ~ 3

  const commands = useMemo(() => getCommands(), []);
  const orchestratorRef = useRef<null | TextAreaCommandOrchestrator>(null);

  return (
    <div className="flex flex-col flex-1">
      <div className="border-b border-zinc-800 flex justify-between">
        <MdToolbar commands={commands} orchestratorRef={orchestratorRef} />
        <ViewToolbar setRatio={setRatio} setPosition={setPosition} />
      </div>
      <div
        className={
          "flex w-full h-screen overflow-auto " + flexDirections[position % 4]
        }
      >
        <EditorTextArea
          hasMdPreview
          position={position}
          ratio={maxRatio - ratio}
          commands={commands}
          orchestratorRef={orchestratorRef}
        />
        {hasMdPreview && <MdPreview ratio={ratio} />}
      </div>
    </div>
  );
};

import { useMemo, useRef, useState } from "react";

import { TextAreaCommandOrchestrator, getCommands } from "@uiw/react-md-editor";

import { MdPreview } from "./MdPreview";
import { EditorTextArea } from "./EditorTextArea";
import { MdToolbar } from "./MdToolbar";
import { ViewToolbar } from "./ViewToolbar";

export const Editor = () => {
  const [ratio, setRatio] = useState<
    0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  >(7);
  const maxRatio = 12;
  const hasMdPreview = ratio != 0;

  const commands = useMemo(() => getCommands(), []);
  const orchestratorRef = useRef<null | TextAreaCommandOrchestrator>(null);

  return (
    <div className="flex flex-col flex-1">
      <div className="border-b border-zinc-800 flex justify-between">
        <MdToolbar commands={commands} orchestratorRef={orchestratorRef} />
        <ViewToolbar setRatio={setRatio} />
      </div>
      <div className="flex w-full h-screen overflow-auto">
        <EditorTextArea
          hasMdPreview
          ratio={maxRatio - ratio}
          commands={commands}
          orchestratorRef={orchestratorRef}
        />
        {hasMdPreview && <MdPreview ratio={ratio} />}
      </div>
    </div>
  );
};

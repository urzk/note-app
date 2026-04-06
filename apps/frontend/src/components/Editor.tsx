import { useMemo, useRef } from "react";

import { TextAreaCommandOrchestrator, getCommands } from "@uiw/react-md-editor";

import { MdPreview } from "./MdPreview";
import { EditorTextArea } from "./EditorTextArea";
import { MdToolbar } from "./MdToolbar";
import { ViewToolbar } from "./ViewToolBar";

export const Editor = () => {
  const commands = useMemo(() => getCommands(), []);
  const orchestratorRef = useRef<null | TextAreaCommandOrchestrator>(null);

  return (
    <div className="flex flex-col flex-1">
      <div className="border-b border-zinc-800 flex justify-between">
        <MdToolbar commands={commands} orchestratorRef={orchestratorRef} />
        <ViewToolbar />
      </div>
      <div className="flex w-full h-screen overflow-auto">
        <EditorTextArea commands={commands} orchestratorRef={orchestratorRef} />
        <MdPreview />
      </div>
    </div>
  );
};

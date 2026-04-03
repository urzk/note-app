import { useMemo, useRef } from "react";

import { TextAreaCommandOrchestrator, getCommands } from "@uiw/react-md-editor";

import { MdPreview } from "./MdPreview";
import { EditorTextArea } from "./EditorTextArea";
import { Toolbar } from "./Toolbar";

export const Editor = () => {
  const commands = useMemo(() => getCommands(), []);
  const orchestratorRef = useRef<null | TextAreaCommandOrchestrator>(null);

  return (
    <div className="flex flex-col flex-1">
      <div className="border-b border-zinc-800 flex justify-between">
        <Toolbar commands={commands} orchestratorRef={orchestratorRef} />
      </div>
      <div className="flex w-full h-screen overflow-auto">
        <EditorTextArea commands={commands} orchestratorRef={orchestratorRef} />
        <MdPreview />
      </div>
    </div>
  );
};

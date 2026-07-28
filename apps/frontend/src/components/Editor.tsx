import { useMemo, useRef, useEffect } from "react";

import { TextAreaCommandOrchestrator, getCommands } from "@uiw/react-md-editor";

import { MdPreview } from "./MdPreview";
import { CrepeEditorWrapper } from "./CrepeEditorWrapper";
import { EditorTextArea } from "./EditorTextArea";
import { MdToolbar } from "./MdToolbar";

import { useNoteValue } from "../hooks/useNoteValue";
import { useAtomValue } from "jotai";
import { selectedNoteIdAtom } from "src/jotai/atoms";
import { editorViewStateAtom } from "src/jotai/atoms";

import { mutate } from "swr";
import type { Response } from "../types/mdToHastSession";
import { md2hast } from "../utils/md2hast";

export const Editor = () => {
  const editorViewState = useAtomValue(editorViewStateAtom);

  const selectedNoteId = useAtomValue(selectedNoteIdAtom);
  const note = useNoteValue(selectedNoteId);

  const commands = useMemo(() => getCommands(), []);
  const orchestratorRef = useRef<null | TextAreaCommandOrchestrator>(null);

  useEffect(() => {
    const parse = async () => {
      const { sessionId, hast } = await md2hast(note?.content ?? "");
      mutate<Response>("note-hast-cache", (current) =>
        !current || current.sessionId < sessionId
          ? { sessionId, hast }
          : current,
      );
    };
    parse();
  }, [note]);

  return (
    <div className="flex flex-col flex-1">
      <div className="border-b border-zinc-800 flex justify-between">
        <MdToolbar commands={commands} orchestratorRef={orchestratorRef} />
      </div>
      <div className={"flex w-full h-screen overflow-auto"}>
        {editorViewState === "editor" && (
          <EditorTextArea
            commands={commands}
            orchestratorRef={orchestratorRef}
          />
        )}
        {editorViewState === "preview" && <CrepeEditorWrapper />}
      </div>
    </div>
  );
};

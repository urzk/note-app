import { useEffect, useMemo, useRef } from "react";
import type { KeyboardEvent } from "react";
import useSWR from "swr";

import {
  handleKeyDown,
  shortcuts,
  TextAreaCommandOrchestrator,
  getCommands,
} from "@uiw/react-md-editor";

import { useNote } from "./hooks/useNote";
import { getTitle } from "./utils/getTitle";
import { Toolbar } from "./Toolbar";

export const Editor = () => {
  const { data: selectedNoteId } = useSWR<number>("selected-note-id", null);
  const { note, setNote } = useNote(selectedNoteId);

  const commands = useMemo(() => getCommands(), []);
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);
  const orchestratorRef = useRef<null | TextAreaCommandOrchestrator>(null);

  useEffect(() => {
    if (textareaRef.current) {
      orchestratorRef.current = new TextAreaCommandOrchestrator(
        textareaRef.current,
      );
    }
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    handleKeyDown(e, 2, false);
    if (orchestratorRef.current) {
      shortcuts(e, commands, orchestratorRef.current);
    }
  };

  return (
    <div className="flex flex-col grow">
      <div className="border-b border-zinc-800 flex justify-between">
        <Toolbar commands={commands} orchestratorRef={orchestratorRef} />
      </div>
      <div className="flex w-full h-screen overflow-auto">
        <textarea
          className="w-1/2 p-4 overflow-auto resize-none outline-0"
          ref={textareaRef}
          value={note?.content ?? ""}
          onChange={(e) => {
            const content = e.target.value;
            if (note) {
              setNote({
                id: note.id,
                title: getTitle(content),
                content,
                updatedAt: Date.now(),
                isDeleted: false,
              });
            }
          }}
          onKeyDown={onKeyDown}
        />
        <div className="w-1/2 border-l border-zinc-800">ねこ</div>
      </div>
    </div>
  );
};

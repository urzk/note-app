import { useEffect, useMemo, useRef } from "react";
import useSWR from "swr";

import {
  handleKeyDown,
  shortcuts,
  TextAreaCommandOrchestrator,
  getCommands,
} from "@uiw/react-md-editor";

import { useNote } from "./hooks/useNote";
import { getTitle } from "./utils/getTitle";

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

  const onKeyDown = (e) => {
    handleKeyDown(e, 2, false);
    if (orchestratorRef.current) {
      shortcuts(e, getCommands(), orchestratorRef.current);
    }
  };

  return (
    <div className="flex flex-col grow">
      <ul className="border-b border-zinc-800 px-1 flex">
        {commands.map((command) => (
          <li>
            <button
              className="p-1"
              onClick={(e) => {
                e.stopPropagation();
                orchestratorRef.current?.executeCommand(command);
              }}
            >
              {command.icon}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex w-full h-screen overflow-auto">
        <textarea
          className="w-1/2 p-4 overflow-auto resize-none outline-0"
          ref={textareaRef}
          value={note?.content ?? ""}
          onChange={(e) => {
            const content = e.target.value;
            return setNote({
              id: note?.id,
              title: getTitle(content),
              content,
              updatedAt: Date.now(),
            });
          }}
          onKeyDown={onKeyDown}
        />
        <div className="w-1/2 border-l border-zinc-800">ねこ</div>
      </div>
    </div>
  );
};

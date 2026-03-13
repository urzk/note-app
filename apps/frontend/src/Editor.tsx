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
      shortcuts(e, commands, orchestratorRef.current);
    }
  };

  return (
    <div className="flex flex-col grow">
      <div className="border-b border-zinc-800 flex justify-between">
        <ul className="flex items-center px-1 py-0.5">
          {commands.map((command, idx) => {
            if (command.keyCommand === "divider") {
              return (
                <li key={idx} className="w-1 text-center">
                  |
                </li>
              );
            }
            return (
              <li key={idx} className="hover:bg-zinc-800">
                <button
                  className="p-1"
                  {...command.buttonProps}
                  onClick={(e) => {
                    e.stopPropagation();
                    orchestratorRef.current?.executeCommand(command);
                  }}
                >
                  {command.icon}
                </button>
                {Array.isArray(command.children)}
              </li>
            );
          })}
        </ul>
      </div>
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

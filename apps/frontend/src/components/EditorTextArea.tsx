import { useEffect, useRef } from "react";
import type { KeyboardEvent, RefObject } from "react";
import useSWR, { mutate } from "swr";

import {
  handleKeyDown,
  shortcuts,
  TextAreaCommandOrchestrator,
} from "@uiw/react-md-editor";
import type { ICommand } from "@uiw/react-md-editor";

import type { Response } from "../types/mdToHastSession";
import { useNote } from "../hooks/useNote";
import { getTitle } from "../utils/getTitle";
import { md2hast } from "../utils/md2hast";

export const EditorTextArea = ({
  commands,
  orchestratorRef,
}: {
  commands: ICommand<string>[];
  orchestratorRef: RefObject<null | TextAreaCommandOrchestrator>;
}) => {
  const { data: selectedNoteId } = useSWR<number>("selected-note-id", null);
  const { note, setNote } = useNote(selectedNoteId);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    handleKeyDown(e, 2, false);
    if (orchestratorRef.current) {
      shortcuts(e, commands, orchestratorRef.current);
    }
  };

  const textareaRef = useRef<null | HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      orchestratorRef.current = new TextAreaCommandOrchestrator(
        textareaRef.current,
      );
    }
  }, []);

  const titleCacheRef = useRef<{ md: string; title: string } | null>(null);

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
    <div className="flex-1 view-wrapper">
      <textarea
        className="p-4 view resize-none outline-0 disabled:text-zinc-400"
        disabled={!note}
        ref={textareaRef}
        value={note ? note.content : "No note selected"}
        onChange={(e) => {
          const content = e.target.value;
          if (note) {
            setNote({
              id: note.id,
              title: getTitle(content, titleCacheRef),
              content,
              updatedAt: Date.now(),
              isDeleted: false,
            });
          }
        }}
        onKeyDown={onKeyDown}
      />
      <div className="absolute bottom-0 right-0 px-1">
        <small className="bg-zinc-900 opacity-75 text-zinc-400 text-sm">
          {note ? note.content.length + "文字" : ""}
        </small>
      </div>
    </div>
  );
};

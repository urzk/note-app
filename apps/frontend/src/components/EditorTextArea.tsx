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
    <textarea
      className="w-1/2 p-4 overflow-auto resize-none outline-0 disabled:bg-zinc-950"
      disabled={!note}
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
  );
};

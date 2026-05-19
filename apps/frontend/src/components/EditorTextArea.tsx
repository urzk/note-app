import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, RefObject, SyntheticEvent } from "react";
import { mutate } from "swr";
import { useAtomValue, useSetAtom } from "jotai";
import { selectedNoteIdAtom } from "src/jotai/atoms";
import { textSelectionLengthAtom } from "src/jotai/atoms";

import {
  handleKeyDown,
  shortcuts,
  TextAreaCommandOrchestrator,
} from "@uiw/react-md-editor";
import type { ICommand } from "@uiw/react-md-editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import type { Response } from "../types/mdToHastSession";
import { useNote } from "../hooks/useNote";
import { getTitle } from "../utils/getTitle";
import { md2hast } from "../utils/md2hast";

import { flexRatio } from "src/utils/flexRatio";

const borderDirections = ["border-r", "border-t", "border-l", "border-b"];

export const EditorTextArea = ({
  hasMdPreview,
  commands,
  orchestratorRef,
  position,
  ratio,
}: {
  hasMdPreview: boolean;
  commands: ICommand<string>[];
  orchestratorRef: RefObject<null | TextAreaCommandOrchestrator>;
  position: number;
  ratio: number;
}) => {
  const selectedNoteId = useAtomValue(selectedNoteIdAtom);
  const { note, setNote } = useNote(selectedNoteId);
  const setTextSelectionLength = useSetAtom(textSelectionLengthAtom);

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

  const updateSelectionLength = (target: HTMLTextAreaElement) => {
    const start = target.selectionStart ?? 0;
    const end = target.selectionEnd ?? 0;
    setTextSelectionLength(Math.max(0, end - start));
  };

  const handleSelect = (e: SyntheticEvent<HTMLTextAreaElement>) => {
    updateSelectionLength(e.currentTarget);
  };

  useEffect(() => {
    updateSelectionLength(textareaRef.current!);
  });

  useEffect(() => {
    const parse = async () => {
      const { sessionId, hast } = await md2hast(note?.content ?? "");
      mutate<Response>("note-hast-cache", (current) =>
        !current || current.sessionId < sessionId
          ? { sessionId, hast }
          : current,
      );
    };
    if (hasMdPreview) parse();
  }, [note, hasMdPreview]);

  const displayedSelectionLength = useAtomValue(textSelectionLengthAtom);

  let wrapperClassName = flexRatio(ratio) + " view-wrapper";
  if (hasMdPreview)
    wrapperClassName = wrapperClassName + " " + borderDirections[position % 4];

  if (ratio == 0) return <></>;

  return (
    <div className={wrapperClassName}>
      <textarea
        className="p-4 pb-64 view min-w-0 resize-none outline-0 disabled:text-zinc-400"
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
          updateSelectionLength(e.target);
        }}
        onSelect={handleSelect}
        onKeyDown={onKeyDown}
      />
      <div
        className="absolute top-0 right-0 opacity-75"
        onClick={() => textareaRef.current?.focus()}
      >
        <FontAwesomeIcon icon={faPen} />
      </div>
      <div className="absolute bottom-0 right-0 px-1">
        <small className="bg-zinc-900 opacity-75 text-sm">
          {note?.content
            ? displayedSelectionLength > 0
              ? `選択中: ${displayedSelectionLength}文字`
              : `${note.content.length}文字`
            : ""}
        </small>
      </div>
    </div>
  );
};

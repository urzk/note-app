import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, RefObject, SyntheticEvent } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { selectedNoteIdAtom } from "src/jotai/atoms";
import { textSelectionLengthAtom } from "src/jotai/atoms";
import { editorViewStateAtom } from "src/jotai/atoms";

import {
  handleKeyDown,
  shortcuts,
  TextAreaCommandOrchestrator,
} from "@uiw/react-md-editor";
import type { ICommand } from "@uiw/react-md-editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import { useNote } from "../hooks/useNote";
import { getTitle } from "../utils/getTitle";

import "katex/dist/katex.min.css";
import "prism-theme-github/themes/prism-theme-github-copilot.css";

export const EditorTextArea = ({
  commands,
  orchestratorRef,
}: {
  commands: ICommand<string>[];
  orchestratorRef: RefObject<null | TextAreaCommandOrchestrator>;
}) => {
  const selectedNoteId = useAtomValue(selectedNoteIdAtom);
  const { note, setNote } = useNote(selectedNoteId);
  const setTextSelectionLength = useSetAtom(textSelectionLengthAtom);
  const [paddingBottom, setPaddingBottom] = useState<number>(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    handleKeyDown(e, 2, false);
    if (orchestratorRef.current) {
      shortcuts(e, commands, orchestratorRef.current);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      orchestratorRef.current = new TextAreaCommandOrchestrator(
        textareaRef.current,
      );
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (wrapperRef.current) {
        const wrapperHeight = wrapperRef.current.clientHeight;
        setPaddingBottom(Math.round(wrapperHeight / 3));
      }
    });
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }
    return () => resizeObserver.disconnect();
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
    if (note?.content?.length === 0) textareaRef.current?.focus();
    updateSelectionLength(textareaRef.current!);
  });

  const displayedSelectionLength = useAtomValue(textSelectionLengthAtom);

  const setEditorViewState = useSetAtom(editorViewStateAtom);

  return (
    <div className="flex-1 view-wrapper" ref={wrapperRef}>
      <textarea
        className="p-4 view min-w-0 resize-none outline-0 disabled:text-zinc-400"
        style={{ paddingBottom: `${paddingBottom}px` }}
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
        onClick={() => setEditorViewState("preview")}
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

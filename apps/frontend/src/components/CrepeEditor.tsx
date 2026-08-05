import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/nord-dark.css";
import "../crepe.css";

import { useCallback, useLayoutEffect, useRef } from "react";

import { Crepe } from "@milkdown/crepe";

import { $remark } from "@milkdown/utils";
import remarkCjkFriendly from "remark-cjk-friendly";
import remarkCjkFriendlyGfmStrikethrough from "remark-cjk-friendly-gfm-strikethrough";
// import remarkBreaks from "remark-breaks";

import { useAtomValue, useSetAtom } from "jotai";
import { selectedNoteIdAtom } from "src/jotai/atoms";
import {
  editorTextLengthAtom,
  editorTextSelectionLengthAtom,
} from "src/jotai/atoms";
import { useNote } from "../hooks/useNote";
import { getTitle } from "../utils/getTitle";

import { editorViewCtx } from "@milkdown/kit/core";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { TextSelection } from "@milkdown/prose/state";

// import diffMatchPatch from "diff-match-patch";

// import * as Y from "yjs";
// import { WebrtcProvider } from "y-webrtc";
// import { collab, collabServiceCtx } from "@milkdown/plugin-collab";

const cjkFriendlyPlugin = $remark("cjk-friendly", () => remarkCjkFriendly);
const cjkFriendlyGfmStrikethroughPlugin = $remark(
  "cjk-friendly-gfm-strikethrough",
  () => remarkCjkFriendlyGfmStrikethrough,
);
// const breaksPlugin = $remark("breaks", () => remarkBreaks); // 現状効かない TODO: fix or delete

// const dmp = new diffMatchPatch();

export const CrepeEditor = () => {
  const isLoadingRef = useRef<boolean>(true); // noteを開いただけで更新されてしまうのを防ぐためのフラグ。noteがロードされた後にfocusされたらfalseにする。
  const editorRef = useRef<Crepe | null>(null);

  const selectedNoteId = useAtomValue(selectedNoteIdAtom);
  const { note, setNote } = useNote(selectedNoteId);

  const setTextLength = useSetAtom(editorTextLengthAtom);
  const setTextSelectionLength = useSetAtom(editorTextSelectionLengthAtom);

  useLayoutEffect(() => {
    console.assert(!note || note.id === selectedNoteId, "Note ID mismatch");
    const crepe = new Crepe({
      root: "#editor",
      defaultValue: note?.content || "",
    });

    crepe.editor
      // .use(breaksPlugin)
      .use(cjkFriendlyPlugin)
      .use(cjkFriendlyGfmStrikethroughPlugin)
      .config((ctx) => {
        ctx.get(listenerCtx).markdownUpdated((_, md) => {
          if (!isLoadingRef.current && selectedNoteId) {
            setNote({
              id: selectedNoteId,
              title: getTitle(md),
              content: md,
              updatedAt: Date.now(),
              isDeleted: false,
            });
          }
        });

        ctx.get(listenerCtx).updated((_, doc) => {
          setTextLength(doc.content.size);
        });

        ctx.get(listenerCtx).focus((/* ctx */) => {
          console.log("Editor focused");
          isLoadingRef.current = false;
        });

        ctx.get(listenerCtx).selectionUpdated((_, selection) => {
          setTextSelectionLength(selection.to - selection.from);
        });
      })
      .use(listener);

    crepe.create().then(() => {
      editorRef.current = crepe;

      const view = crepe.editor.ctx.get(editorViewCtx);
      setTextLength(view.state.doc.content.size);
    });

    return () => {
      editorRef.current = null;
      isLoadingRef.current = true;
      crepe.destroy();
      setTextSelectionLength(0);
      setTextLength(0);
    };
  }, [selectedNoteId]);

  // editor内で.milkdownの外（小さなnoteの下部の余白）をクリック時に、末尾にカーソルが来るようにfocus()する。
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;

    editorRef.current?.editor.action((ctx) => {
      const view = ctx.get(editorViewCtx);
      const { state } = view;

      view.dispatch(state.tr.setSelection(TextSelection.atEnd(state.doc)));

      view.focus();
    });
  }, []);

  return <div id="editor" onClick={handleClick} className="view" />;
};

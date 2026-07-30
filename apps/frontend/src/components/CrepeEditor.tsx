import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/nord-dark.css";
import "../crepe.css";

import { useCallback, useEffect, useRef } from "react";

import { Crepe } from "@milkdown/crepe";

import { $remark } from "@milkdown/utils";
import remarkCjkFriendly from "remark-cjk-friendly";
import remarkCjkFriendlyGfmStrikethrough from "remark-cjk-friendly-gfm-strikethrough";
import remarkBreaks from "remark-breaks";

import { useAtomValue } from "jotai";
import { selectedNoteIdAtom } from "src/jotai/atoms";
import { useNote } from "../hooks/useNote";
import { getTitle } from "../utils/getTitle";

import { editorViewCtx } from "@milkdown/kit/core";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { TextSelection } from "@milkdown/prose/state";

import diffMatchPatch from "diff-match-patch";

// import * as Y from "yjs";
// import { WebrtcProvider } from "y-webrtc";
// import { collab, collabServiceCtx } from "@milkdown/plugin-collab";

const cjkFriendlyPlugin = $remark("cjk-friendly", () => remarkCjkFriendly);
const cjkFriendlyGfmStrikethroughPlugin = $remark(
  "cjk-friendly-gfm-strikethrough",
  () => remarkCjkFriendlyGfmStrikethrough,
);
const breaksPlugin = $remark("breaks", () => remarkBreaks); // 現状効かない TODO: fix or delete

const dmp = new diffMatchPatch();

export const CrepeEditor = () => {
  const loading = useRef<boolean>(true); // noteを開いただけで更新されてしまうのを防ぐためのフラグ。noteがロードされた後にfocusされたらfalseにする。
  const editorRef = useRef<Crepe | null>(null);

  const selectedNoteId = useAtomValue(selectedNoteIdAtom);
  const { note, setNote } = useNote(selectedNoteId);

  useEffect(() => {
    console.assert(!note || note.id === selectedNoteId, "Note ID mismatch");
    const crepe = new Crepe({
      root: "#editor",
      defaultValue: note?.content || "",
    });

    crepe.editor
      .use(breaksPlugin)
      .use(cjkFriendlyPlugin)
      .use(cjkFriendlyGfmStrikethroughPlugin)
      .config((ctx) => {
        ctx.get(listenerCtx).markdownUpdated((_, markdown, prevMarkdown) => {
          console.log(
            "Markdown updated:",
            dmp.diff_main(prevMarkdown, markdown),
          );
          console.log("loading", loading.current);
          if (!loading.current && selectedNoteId) {
            setNote({
              id: selectedNoteId,
              title: getTitle(markdown),
              content: markdown,
              updatedAt: Date.now(),
              isDeleted: false,
            });
          }
        });
        ctx.get(listenerCtx).focus((/* ctx */) => {
          console.log("Editor focused");
          loading.current = false;
        });
      })
      .use(listener);

    crepe.create().then(() => {
      editorRef.current = crepe;
    });

    return () => {
      editorRef.current = null;
      loading.current = true;
      crepe.destroy();
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

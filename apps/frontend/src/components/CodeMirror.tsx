import { useLayoutEffect, useRef } from "react";

import { basicSetup } from "codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

import { useAtomValue, useSetAtom } from "jotai";
import { selectedNoteIdAtom } from "src/jotai/atoms";
import { useNote } from "../hooks/useNote";
import { getTitle } from "../utils/getTitle";
import {
  editorTextLengthAtom,
  editorTextSelectionLengthAtom,
} from "src/jotai/atoms";

// Markdown記法のハイライト設定
const highlightStyle = HighlightStyle.define([
  { tag: tags.heading1, fontSize: "2em", fontWeight: "700" },
  { tag: tags.heading2, fontSize: "1.782em", fontWeight: "700" },
  { tag: tags.heading3, fontSize: "1.587em", fontWeight: "700" },
  { tag: tags.heading4, fontSize: "1.414em", fontWeight: "700" },
  { tag: tags.heading5, fontSize: "1.260em", fontWeight: "700" },
  { tag: tags.heading6, fontSize: "1.122em", fontWeight: "700" },
  { tag: tags.strong, fontWeight: "700" }, // 太字
  { tag: tags.quote, color: "#6a737d" }, // 引用
  { tag: tags.emphasis, fontStyle: "italic" }, // 斜体
  { tag: tags.url, textDecoration: "underline" }, // URLに下線をつける
  { tag: tags.strikethrough, textDecoration: "line-through" }, // 打ち消し線（GFM拡張）
]);

const markdownExtension = markdown({
  base: markdownLanguage, // Language support for GFM plus subscript, superscript, and emoji syntax.
  completeHTMLTags: false, // HTMLタグのオートコンプリートを無効化
});

const theme = EditorView.theme({
  ".cm-line": {
    lineHeight: "1.5",
    fontSize: "1rem",
    fontFamily: "sans-serif",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-gutters": {
    backgroundColor: "inherit",
    border: "none",
    // flexDirection: "row-reverse",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#fff1",
  },
  ".cm-activeLine": {
    backgroundColor: "inherit",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 4px",
  },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#ccc" },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
    { backgroundColor: "#22262a" },
});

export const CodeMirror = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const selectedNoteId = useAtomValue(selectedNoteIdAtom);
  const { note, setNote } = useNote(selectedNoteId);

  const setTextLength = useSetAtom(editorTextLengthAtom);
  const setTextSelectionLength = useSetAtom(editorTextSelectionLengthAtom);

  useLayoutEffect(() => {
    if (!editorRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.selectionSet) {
        setTextSelectionLength(
          update.state.selection.ranges[0].to -
            update.state.selection.ranges[0].from,
        );
      }
      if (update.docChanged && selectedNoteId) {
        setTextLength(update.state.doc.length);

        const text = update.state.doc.toString();
        setNote({
          id: selectedNoteId,
          title: getTitle(text),
          content: text,
          updatedAt: Date.now(),
          isDeleted: false,
        });
      }
    });

    setTextLength(note?.content.length ?? 0);

    const state = EditorState.create({
      doc: note?.content || "",
      extensions: [
        basicSetup,
        markdownExtension,
        syntaxHighlighting(highlightStyle),
        theme,
        updateListener,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });
    return () => {
      view.destroy();
      setTextSelectionLength(0);
      setTextLength(0);
    };
  }, [selectedNoteId]);
  return <div id="editor" ref={editorRef} className="view"></div>;
};

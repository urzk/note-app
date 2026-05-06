import { useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { editorStateAtom, notesUpdatedAtAtom } from "src/jotai/atoms";

export const useEditorState = () => {
  // 編集の状態("editing" or "idle")を管理するためのstateとuseEffect
  const setEditorState = useSetAtom(editorStateAtom);
  const notesUpdatedAt = useAtomValue(notesUpdatedAtAtom);
  const lastUpdatedRef = useRef<number>(0);

  useEffect(() => {
    if (notesUpdatedAt) setEditorState("editing");
    console.log(notesUpdatedAt);
    const timeStamp = notesUpdatedAt;
    lastUpdatedRef.current = timeStamp;
    const timeoutId = setTimeout(() => {
      console.log("timeStamp", timeStamp);
      if (lastUpdatedRef.current === timeStamp) {
        setEditorState("idle");
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [notesUpdatedAt]);
};

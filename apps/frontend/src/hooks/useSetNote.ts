import useSWR from "swr";
import { useSetAtom } from "jotai";
import { editorStateAtom, notesUpdatedAtAtom } from "src/jotai/atoms";
import { debounce, throttle } from "lodash";

import type { Note } from "@shared/types/note";

export const useSetNote = () => {
  const { mutate } = useSWR<Note[]>("notes-updated", null);
  const setNotesUpdatedAt = useSetAtom(notesUpdatedAtAtom);

  const setEditorState = useSetAtom(editorStateAtom);

  const setEditingThrottled = throttle(() => {
    console.log("editing");
    setEditorState("editing");
  }, 250);

  const setIdleDebounced = debounce(() => {
    console.log("idle");
    setEditorState("idle");
  }, 500);

  const setNote = (note: Note) => {
    setNotesUpdatedAt(note.updatedAt); // 更新日時を更新 -> editorのstateを"idle"から"editing"にする -> "idle"に戻った時にセーブが実行される

    setEditingThrottled();
    mutate<Note[]>( // notesUpdatedを更新
      (current = []) => [note, ...current.filter((n) => n.id !== note.id)],
      false,
    );
    setIdleDebounced();
  };

  return setNote;
};

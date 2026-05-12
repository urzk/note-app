import useSWR from "swr";
import { useSetAtom } from "jotai";
import { notesUpdatedAtAtom } from "src/jotai/atoms";

import type { Note } from "@shared/types/note";

export const useSetNote = () => {
  const { mutate } = useSWR<Note[]>("notes-updated", null);
  const setNotesUpdatedAt = useSetAtom(notesUpdatedAtAtom);

  const setNote = (note: Note) => {
    setNotesUpdatedAt(note.updatedAt); // 更新日時を更新 -> editorのstateを"idle"から"editing"にする -> "idle"に戻った時にセーブが実行される
    mutate<Note[]>( // notesUpdatedを更新
      (current = []) => [note, ...current.filter((n) => n.id !== note.id)],
      false,
    );
  };

  return setNote;
};

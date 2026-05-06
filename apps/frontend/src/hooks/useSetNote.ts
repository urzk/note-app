import useSWR from "swr";
import { useSetAtom } from "jotai";
import { notesUpdatedAtAtom } from "src/jotai/atoms";

import type { Note } from "@shared/types/note";

export const useSetNote = () => {
  const { mutate } = useSWR<Note[]>("notes-updated", null);
  const setNotesUpdatedAt = useSetAtom(notesUpdatedAtAtom);

  const setNote = (note: Note) => {
    setNotesUpdatedAt(note.updatedAt);
    mutate<Note[]>(
      (current = []) => [note, ...current.filter((n) => n.id !== note.id)],
      false,
    );
  };

  return setNote;
};

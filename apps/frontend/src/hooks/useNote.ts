import useSWR from "swr";
import { useSetAtom } from "jotai";
import { notesUpdatedAtAtom } from "src/jotai/atoms";

import type { Note } from "@shared/types/note";

export const useNote = (
  id: string | undefined,
): {
  note: Note | undefined;
  setNote: (note: Note) => void;
} => {
  const { data: notesUpdated, mutate } = useSWR<Note[]>("notes-updated", null);
  const { data: notesSynced } = useSWR<Note[]>("notes-synced", null);
  const setNotesUpdatedAt = useSetAtom(notesUpdatedAtAtom);

  const setNote = (note: Note) => {
    setNotesUpdatedAt(note.updatedAt);
    mutate<Note[]>(
      (current = []) => [note, ...current.filter((n) => n.id !== note.id)],
      false,
    );
  };

  const note =
    id === undefined
      ? undefined
      : (notesUpdated?.find((n) => n.id === id) ??
        notesSynced?.find((n) => n.id === id));

  return { note, setNote };
};

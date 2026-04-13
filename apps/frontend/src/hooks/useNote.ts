import useSWR from "swr";
import type { Note } from "@shared/types/note";
import db from "src/lib/db/clientDB";

export const useNote = (
  id: number | undefined,
): { note: Note | undefined; setNote: (note: Note) => void } => {
  const { data: notesUpdated, mutate } = useSWR<Note[]>("notes-updated", null);
  const { data: notesSynced } = useSWR<Note[]>("notes-synced", null);
  const setNote = (note: Note) => {
    mutate((current = []) => [
      note,
      ...current.filter((n) => n.id !== note.id),
    ]);
    db.updated.put(note).catch(console.error);
  };
  const note =
    id === undefined
      ? undefined
      : (notesUpdated?.find((n) => n.id === id) ??
        notesSynced?.find((n) => n.id === id));
  return { note, setNote };
};

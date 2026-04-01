import useSWR from "swr";
import type { Note, NotesApiResponse } from "@shared/types/note";

export const useNote = (
  id: number | undefined,
): { note: Note | undefined; setNote: (note: Note) => void } => {
  const { data: notesUpdated, mutate } = useSWR<Note[]>("notes-updated", null);
  const { data: notesSynced } = useSWR<NotesApiResponse>("notes-synced", null);
  const setNote = (note: Note) => {
    mutate((current = []) => [
      note,
      ...current.filter((n) => n.id !== note.id),
    ]);
  };
  const note =
    id === undefined
      ? undefined
      : (notesUpdated?.find((n) => n.id === id) ??
        notesSynced?.notes.find((n) => n.id === id));
  return { note, setNote };
};

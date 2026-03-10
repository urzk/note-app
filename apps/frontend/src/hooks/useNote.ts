import useSWR from "swr";
import type { Note, NotesApi } from "@shared/types/note";

export const useNote = (id: number = 0) => {
  const { data: notesUpdated, mutate } = useSWR<Note[]>("notes-updated", null);
  const { data: notesSynced } = useSWR<NotesApi>("notes-synced", null);
  const setNote = (note: Note) => {
    if (notesUpdated === undefined) {
      mutate([note]);
    } else {
      mutate([note, ...notesUpdated.filter((n) => n.id !== id)]);
    }
  };
  const noteUpdated = notesUpdated?.find((n) => n.id === id);
  if (noteUpdated !== undefined) {
    return { note: noteUpdated, setNote };
  } else {
    const note = notesSynced?.notes.find((n) => n.id === id);
    return { note, setNote };
  }
};

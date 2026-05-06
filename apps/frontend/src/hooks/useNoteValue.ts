import useSWR from "swr";

import type { Note } from "@shared/types/note";

export const useNoteValue = (id: string | undefined) => {
  const { data: notesUpdated } = useSWR<Note[]>("notes-updated", null);
  const { data: notesSynced } = useSWR<Note[]>("notes-synced", null);

  const note =
    id === undefined
      ? undefined
      : (notesUpdated?.find((n) => n.id === id) ??
        notesSynced?.find((n) => n.id === id));

  return note;
};

import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import type { Note } from "@shared/types/note";
import db from "src/lib/db/clientDB";
import localFetcher from "src/utils/localFetcher";

export const useNote = (
  id: number | undefined,
): {
  note: Note | undefined;
  setNote: (note: Note) => void;
  isValidating: boolean;
} => {
  const {
    data: notesUpdated,
    mutate,
    isValidating,
  } = useSWRImmutable<Note[]>("notes-updated", () => localFetcher("updated"));
  const { data: notesSynced } = useSWR<Note[]>("notes-synced", null);

  const setNote = (note: Note) => {
    mutate(
      async () => {
        await db.updated.put(note);
        return await localFetcher("updated");
      },
      {
        optimisticData: (current = []) => [
          note,
          ...current.filter((n) => n.id !== note.id),
        ],
      },
    );
  };

  const note =
    id === undefined
      ? undefined
      : (notesUpdated?.find((n) => n.id === id) ??
        notesSynced?.find((n) => n.id === id));

  return { note, setNote, isValidating };
};

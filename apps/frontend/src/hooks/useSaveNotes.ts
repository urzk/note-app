import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

import type { Note } from "@shared/types/note";
import db from "src/lib/db/clientDB";
import localFetcher from "src/utils/localFetcher";

const fetchSavedNotes = async () => {
  const map = new Map<number, number>();
  await db.updated.each(({ id, updatedAt }) => {
    map.set(id, updatedAt);
  });
  return map;
};

export const useSaveNotes = () => {
  const {
    data: savedNotes,
    isLoading,
    mutate,
  } = useSWRImmutable<Map<number, number>>(
    "notes-updated-saved",
    fetchSavedNotes,
    {
      dedupingInterval: 250,
      refreshWhenOffline: true,
    },
  );

  const { data: notesUpdated } = useSWRImmutable<Note[]>(
    "notes-updated",
    () => localFetcher("updated"),
    { refreshWhenOffline: true },
  );
  const isSaved = (note: Note) => {
    // return true when isLoading
    return isLoading || savedNotes?.get(note.id) === note.updatedAt;
  };

  useSWR(
    "notes-updated-save",
    async () => {
      if (isLoading) return;
      const unSavedNotes = notesUpdated?.filter((note) => !isSaved(note)) ?? [];
      if (unSavedNotes.length !== 0) {
        await db.updated.bulkPut(unSavedNotes);
        mutate();
      }
    },
    { dedupingInterval: 250, refreshInterval: 250, refreshWhenOffline: true },
  );

  return { isSaved };
};

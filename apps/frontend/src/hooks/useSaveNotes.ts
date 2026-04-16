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
  const { data: savedNotes, mutate } = useSWRImmutable<Map<number, number>>(
    "notes-updated-saved",
    fetchSavedNotes,
    {
      dedupingInterval: 250,
      refreshWhenOffline: true,
      compare: (a, b) => {
        if (a === b) {
          return true; // return true when both are undefined
        } else {
          if (!a || !b || a.size !== b.size) return false; // return false when either is undefined
          for (const [key, value] of a) {
            if (b.get(key) !== value) return false;
          }
          return true;
        }
      },
    },
  );

  const { data: notesUpdated } = useSWRImmutable<Note[]>(
    "notes-updated",
    () => localFetcher("updated"),
    { refreshWhenOffline: true },
  );
  const isSaved = (note: Note) => {
    return savedNotes?.get(note.id) === note.updatedAt;
  };

  useSWR(
    "notes-updated-save",
    async () => {
      let count: number = 0;
      for (const note of notesUpdated ?? []) {
        if (!isSaved(note)) {
          await db.updated.put(note);
          count++;
        }
      }
      if (count > 0) {
        mutate();
      }
    },
    { dedupingInterval: 250, refreshInterval: 250, refreshWhenOffline: true },
  );

  return { isSaved };
};

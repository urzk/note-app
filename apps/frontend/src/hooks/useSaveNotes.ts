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
    { refreshWhenOffline: true },
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
      // 0.5秒間隔に実行したい。複数コンポーネントからこのフックが読み込まれていても重複実行されないようにしたい
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
    { refreshInterval: 500 },
  );

  return { isSaved };
};

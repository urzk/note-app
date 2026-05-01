import { useEffect } from "react";

import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

import type { Note } from "@shared/types/note";
import db from "src/lib/db/clientDB";
import localFetcher from "src/utils/localFetcher";

const fetchSavedNotes = async () => {
  const map = new Map<string, number>();
  await db.updated.each(({ id, updatedAt }) => {
    map.set(id, updatedAt);
  });
  return map;
};

// ローカルのupdatedに保存済みのnotesのメタデータ
export const useSaveNotes = () => {
  const {
    data: savedNotes,
    isLoading,
    mutate,
  } = useSWRImmutable<Map<string, number>>(
    "notes-updated-saved",
    fetchSavedNotes,
    {
      refreshWhenOffline: true,
    },
  );

  // updatedのキャッシュ（未保存のnotes含む）
  const { data: notesUpdated } = useSWRImmutable<Note[]>(
    "notes-updated",
    () => localFetcher("updated"),
    { refreshWhenOffline: true },
  );
  const isSaved = (note: Note) => {
    // return true when isLoading
    return isLoading || savedNotes?.get(note.id) === note.updatedAt;
  };

  // 0.25秒ごとに実行、updatedのキャッシュのうち、保存されていないものをローカルのupdatedに保存、保存済みnotesのメタデータを更新
  const { mutate: saveNotes } = useSWRImmutable(
    "notes-updated-save",
    async () => {
      if (isLoading) return;
      const unSavedNotes = notesUpdated?.filter((note) => !isSaved(note)) ?? [];
      if (unSavedNotes.length !== 0) {
        await db.updated.bulkPut(unSavedNotes);
        mutate();
      }
    },
    { refreshWhenOffline: true },
  );
  const { data: notesState } = useSWR<"editing" | "idle">("notes-state", null);
  useEffect(() => {
    if (notesState === "idle") {
      saveNotes();
    }
  }, [notesState]);

  return { isSaved };
};

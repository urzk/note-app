import { useRef } from "react";
import useSWR from "swr";
import type { Note, NotesApi } from "@shared/types/note";
import { mergeNotes } from "../utils/mergeNotes";
import { syncFetcher } from "../utils/syncFetcher";

export const useSyncNotesData = () => {
  const { data: notesSyncCurrent } = useSWR<NotesApi>("notes-synced", null);
  const { data: notesLocalUpdated, mutate: notesLocalMutate } = useSWR<Note[]>(
    "notes-updated",
    null,
  );
  const fulfilledSyncLocalTimeStampRef = useRef<{
    start: number;
  } | null>(null);

  useSWR<NotesApi>( // only process to update "notes-synced" in this app
    "notes-synced",
    async () => {
      const updatedAfter = notesSyncCurrent?.serverTime;
      const syncStartTimeStamp = Date.now();
      const notesSyncUpdates = await syncFetcher(
        updatedAfter,
        [], // -> notesLocalUpdated,
      );
      // console.log("data fetched!");
      const notesSyncNew = notesSyncCurrent
        ? mergeNotes(notesSyncCurrent, notesSyncUpdates)
        : notesSyncUpdates;
      fulfilledSyncLocalTimeStampRef.current = {
        start: syncStartTimeStamp,
      };
      return notesSyncNew;
    },
    {
      /*
      onSuccess: () => {
        notesLocalMutate((notesLocalUpdated) => {
          const timeStamp = fulfilledSyncLocalTimeStampRef?.current?.start ?? 0;
          return notesLocalUpdated?.filter(
            (note) => note.updatedAt > timeStamp,
          );
        });
      },
      */
      refreshInterval: 3000,
    },
  );
};

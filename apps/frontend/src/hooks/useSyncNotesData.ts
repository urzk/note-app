import { useRef } from "react";
import useSWR, { mutate } from "swr";

import type { Note } from "@shared/types/note";
import { mergeNotes } from "../utils/mergeNotes";
import { getFetcher, putFetcher } from "../utils/fetcher";

export const useSyncNotesData = () => {
  const { data: notesSyncedCurrent } = useSWR<Note[]>("notes-synced", null);
  const { data: notesLocalUpdates, mutate: notesLocalMutate } = useSWR<Note[]>(
    "notes-updated",
    null,
  );
  const putLocalTimeStampRef = useRef<number>(0);

  useSWR<Note[]>( // only process to update "notes-synced" in this app
    "notes-synced",
    async () => {
      const hasSynced = notesSyncedCurrent && notesSyncedCurrent.length > 0;
      const hasLocalUpdates = notesLocalUpdates && notesLocalUpdates.length > 0;
      const updatedAfter = hasSynced
        ? notesSyncedCurrent[0].updatedAt
        : undefined;
      const startTimeStamp = hasLocalUpdates
        ? notesLocalUpdates[0].updatedAt
        : 0;

      const notesResponse = hasLocalUpdates
        ? await putFetcher(updatedAfter, notesLocalUpdates)
        : await getFetcher(updatedAfter);

      let updateError: unknown | undefined = undefined;
      if ("updateError" in notesResponse) {
        updateError = notesResponse.updateError;
        console.error(updateError);
      }
      const { serverTime, notes: notesUpdated } = notesResponse;
      const notesSyncedNew = notesSyncedCurrent
        ? mergeNotes(notesSyncedCurrent, notesUpdated)
        : notesUpdated;

      mutate<number>("last-synced-time", serverTime);

      if (
        hasLocalUpdates &&
        !updateError &&
        putLocalTimeStampRef.current < startTimeStamp
      ) {
        putLocalTimeStampRef.current = startTimeStamp;
      }
      return notesSyncedNew;
    },
    {
      onSuccess: () => {
        notesLocalMutate((notesLocalUpdates) => {
          const timeStamp = putLocalTimeStampRef.current;
          return notesLocalUpdates?.filter(
            (note) => note.updatedAt > timeStamp,
          );
        });
      },
      refreshInterval: 3000,
    },
  );
};

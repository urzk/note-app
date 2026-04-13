import { useRef } from "react";
import useSWR, { mutate } from "swr";

import db from "src/lib/db/clientDB";
import type { Note } from "@shared/types/note";
import { mergeNotes } from "../utils/mergeNotes";
import { getFetcher, putFetcher } from "../utils/fetcher";
import type {
  NotesApiResponse,
  NotesSyncApiResponse,
} from "@shared/types/note";

export const useSyncNotesData = () => {
  const { data: notesSyncedCurrent } = useSWR<Note[]>("notes-synced", null);
  const { data: notesLocalUpdates } = useSWR<Note[]>("notes-updated", null);
  const putLocalTimeStampRef = useRef<number>(0);

  const hasSynced = notesSyncedCurrent && notesSyncedCurrent.length > 0;
  const hasLocalUpdates = notesLocalUpdates && notesLocalUpdates.length > 0;
  const updatedAfter = hasSynced ? notesSyncedCurrent[0].updatedAt : undefined;
  const startTimeStamp = hasLocalUpdates ? notesLocalUpdates[0].updatedAt : 0;

  useSWR<NotesApiResponse | NotesSyncApiResponse>( // only process to update "notes-synced" in this app
    "notes-sync",
    async () =>
      hasLocalUpdates
        ? await putFetcher(updatedAfter, notesLocalUpdates)
        : await getFetcher(updatedAfter),
    {
      onSuccess: async (apiResponse) => {
        let updateError: unknown | undefined = undefined;
        if ("updateError" in apiResponse) {
          updateError = apiResponse.updateError;
          console.error(updateError);
        }
        const { serverTime, notes: notesUpdated } = apiResponse;

        mutate<number>("last-synced-time", serverTime);

        // await db.synced.bulkPut(notesUpdated);

        const notesSyncedNew = notesSyncedCurrent
          ? mergeNotes(notesSyncedCurrent, notesUpdated)
          : notesUpdated;

        mutate<Note[]>("notes-synced", notesSyncedNew);

        if (
          hasLocalUpdates &&
          !updateError &&
          putLocalTimeStampRef.current < startTimeStamp
        ) {
          putLocalTimeStampRef.current = startTimeStamp;
        }

        mutate<Note[]>("notes-updated", async (notesLocalUpdates) => {
          const timeStamp = putLocalTimeStampRef.current;
          const unSyncedNotes = notesLocalUpdates?.filter(
            (note) => note.updatedAt > timeStamp,
          );
          return unSyncedNotes;
        });
      },
      refreshInterval: 2000,
    },
  );
};

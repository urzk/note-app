import { useRef } from "react";
import useSWR, { mutate } from "swr";
import useSWRImmutable from "swr/immutable";

import db from "src/lib/db/clientDB";
import localFetcher from "src/utils/localFetcher";
import type { Note } from "@shared/types/note";
import { mergeNotes } from "../utils/mergeNotes";
import { getFetcher, putFetcher } from "../utils/fetcher";
import type {
  NotesApiResponse,
  NotesSyncApiResponse,
} from "@shared/types/note";

export const useSyncNotes = () => {
  const { data: notesSynced, mutate: mutateNotesSynced } = useSWRImmutable<
    Note[]
  >("notes-synced", () => localFetcher("synced"), { refreshWhenOffline: true });
  const { data: notesUpdated, mutate: mutateNotesUpdated } = useSWR<Note[]>(
    "notes-updated",
    null,
  );
  const putLocalTimeStampRef = useRef<number>(0);

  const hasSynced = notesSynced && notesSynced.length > 0;
  const hasUpdated = notesUpdated && notesUpdated.length > 0;
  const updatedAfter = hasSynced ? notesSynced[0].updatedAt : undefined;
  const startTimeStamp = hasUpdated ? notesUpdated[0].updatedAt : 0;

  useSWR<NotesApiResponse | NotesSyncApiResponse>(
    "notes-sync",
    async () =>
      hasUpdated
        ? await putFetcher(updatedAfter, notesUpdated)
        : await getFetcher(updatedAfter),
    {
      onSuccess: async (apiResponse) => {
        let updateError: unknown | undefined = undefined;
        if ("updateError" in apiResponse) {
          updateError = apiResponse.updateError;
          console.error(updateError);
        }
        const { serverTime, notes: notesFromServer } = apiResponse;

        mutate<number>("last-synced-time", serverTime);

        await db.synced.bulkPut(notesFromServer);

        const notesSyncedNew = notesSynced
          ? mergeNotes(notesSynced, notesFromServer)
          : notesFromServer;
        mutateNotesSynced<Note[]>(notesSyncedNew, false);

        if (
          hasUpdated &&
          !updateError &&
          putLocalTimeStampRef.current < startTimeStamp
        ) {
          putLocalTimeStampRef.current = startTimeStamp;
        }

        mutateNotesUpdated<Note[]>(async (notesLocalUpdates) => {
          const timeStamp = putLocalTimeStampRef.current;
          const unSyncedNotes = notesLocalUpdates?.filter(
            (note) => note.updatedAt > timeStamp,
          );
          await db.updated.clear(); // TODO: optimize to only delete synced notes
          if (unSyncedNotes) await db.updated.bulkPut(unSyncedNotes);
          return unSyncedNotes;
        });
      },
      refreshInterval: 2000,
    },
  );
};

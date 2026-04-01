import { useRef } from "react";
import useSWR from "swr";

import type { Note, NotesApiResponse } from "@shared/types/note";
import { mergeNotes } from "../utils/mergeNotes";
import { syncFetcher } from "../utils/syncFetcher";

export const useSyncNotesData = () => {
  const { data: notesSyncCurrent } = useSWR<NotesApiResponse>(
    "notes-synced",
    null,
  );
  const { data: notesLocalUpdates, mutate: notesLocalMutate } = useSWR<Note[]>(
    "notes-updated",
    null,
  );
  const putLocalTimeStampRef = useRef<number>(0);
  const serverTimeRef = useRef<number>(0);

  useSWR<NotesApiResponse>( // only process to update "notes-synced" in this app
    "notes-synced",
    async () => {
      const updatedAfter = notesSyncCurrent?.serverTime;
      const hasUpdates = notesLocalUpdates && notesLocalUpdates.length > 0;
      const startTimeStamp = hasUpdates ? notesLocalUpdates[0].updatedAt : 0;

      const notesSyncUpdates = await syncFetcher(
        updatedAfter,
        notesLocalUpdates,
      );
      if ("updateError" in notesSyncUpdates) {
        const { updateError } = notesSyncUpdates;
        console.error(updateError);
      }
      const notesSyncNew = notesSyncCurrent
        ? mergeNotes(notesSyncCurrent, notesSyncUpdates)
        : notesSyncUpdates;

      const serverTime = notesSyncNew.serverTime;
      if (serverTimeRef.current > serverTime) {
        throw new Error("Not newest data!");
      }
      serverTimeRef.current = serverTime;
      if (hasUpdates && putLocalTimeStampRef.current < startTimeStamp) {
        putLocalTimeStampRef.current = startTimeStamp;
      }
      return notesSyncNew;
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

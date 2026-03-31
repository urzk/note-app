import { useRef } from "react";
import useSWR from "swr";

import type { Note, NotesApi } from "@shared/types/note";
import { mergeNotes } from "../utils/mergeNotes";
import { syncFetcher } from "../utils/syncFetcher";

export const useSyncNotesData = () => {
  const { data: notesSyncCurrent } = useSWR<NotesApi>("notes-synced", null);
  const { data: notesLocalUpdates, mutate: notesLocalMutate } = useSWR<Note[]>(
    "notes-updated",
    null,
  );
  const postLocalTimeStampRef = useRef<number>(0);
  const serverTimeRef = useRef<number>(0);

  useSWR<NotesApi>( // only process to update "notes-synced" in this app
    "notes-synced",
    async () => {
      const updatedAfter = notesSyncCurrent?.serverTime;
      const hasUpdates = notesLocalUpdates && notesLocalUpdates.length > 0;
      const startTimeStamp = hasUpdates ? notesLocalUpdates[0].updatedAt : 0;

      const notesSyncUpdates = await syncFetcher(
        updatedAfter,
        [], // -> notesLocalUpdates,
      );
      const notesSyncNew = notesSyncCurrent
        ? mergeNotes(notesSyncCurrent, notesSyncUpdates)
        : notesSyncUpdates;

      const serverTime = notesSyncNew.serverTime;
      if (serverTimeRef.current > serverTime) {
        throw new Error("Not newest data!");
      }
      serverTimeRef.current = serverTime;
      if (hasUpdates && postLocalTimeStampRef.current < startTimeStamp) {
        postLocalTimeStampRef.current = startTimeStamp;
      }
      return notesSyncNew;
    },
    {
      /*
      onSuccess: () => {
        notesLocalMutate((notesLocalUpdates) => {
          const timeStamp = postLocalTimeStampRef.current;
          return notesLocalUpdates?.filter(
            (note) => note.updatedAt > timeStamp,
          );
        });
      },
      */
      refreshInterval: 3000,
    },
  );
};

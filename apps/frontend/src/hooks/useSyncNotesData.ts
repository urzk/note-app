import useSWR from "swr";
import type { NotesApi } from "@shared/types/note";
import { mergeNotes } from "../utils/mergeNotes";
import { syncFetcher } from "../utils/syncFetcher";

export const useSyncNotesData = (key: string) => {
  const { data: current } = useSWR<NotesApi>(key, null);
  return useSWR<NotesApi>(
    key,
    async () => {
      //const current = cache.get(key) as NotesApi | undefined;
      const updated = await syncFetcher(current, []);
      console.log("data fetched!");
      return current ? mergeNotes(current, updated) : updated;
    },
    {
      refreshInterval: 3000,
    },
  );
};

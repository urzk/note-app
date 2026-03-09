import useSWR from "swr";
import type { NotesApi } from "@shared/types/note";
import { mergeNotes } from "../utils/mergeNotes";

const fetcher = (key: string) =>
  fetch("http://localhost:3000" + key).then((res) => res.json());

export const useSyncNotesData = (key: string) => {
  const { data: current } = useSWR<NotesApi>(key, null);
  return useSWR<NotesApi>(
    key,
    async () => {
      //const current = cache.get(key) as NotesApi | undefined;
      const url = current?.serverTime
        ? `/v1/notes?updatedAfter=${current.serverTime}`
        : "/v1/notes";
      const updated: NotesApi = await fetcher(url);
      console.log("data fetched!");
      return current ? mergeNotes(current, updated) : updated;
    },
    {
      refreshInterval: 3000,
    },
  );
};

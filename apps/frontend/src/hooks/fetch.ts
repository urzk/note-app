import useSWR, { mutate } from "swr";
import useSWRImmutable from "swr/immutable";
import type { NotesApi } from "@shared/types/note";
import { mergeNotes } from "../utils/mergeNotes";

const fetcher = (key: string) =>
  fetch("http://localhost:3000" + key).then((res) => res.json());
export const useSyncedNotesData = () =>
  useSWRImmutable<NotesApi>("/v1/notes", fetcher);

export const useFetchNotesData = () => {
  const updatedAfter = useSyncedNotesData().data?.serverTime;
  const fetchAll = !updatedAfter;
  console.log(updatedAfter);
  useSWR<NotesApi | { err: unknown }>(
    "/v1/notes/updates",
    () =>
      fetcher(
        updatedAfter ? `/v1/notes?updatedAfter=${updatedAfter}` : "/v1/notes",
      ),
    {
      refreshInterval: 3_000, // 3秒ごとに再取得
      onSuccess: (updatedData) => {
        if (!fetchAll) {
          mutate(
            "/v1/notes",
            (currentData = []) => {
              return mergeNotes(currentData, updatedData);
            }, // TODO: localStorageに保存
            { revalidate: false },
          );
        }
      },
    },
  );
};

import useSWR, { mutate } from "swr";
import useSWRImmutable from "swr/immutable";

import db from "src/lib/db/clientDB";
import localFetcher from "src/utils/localFetcher";
import type { Note } from "@shared/types/note";
import { mergeNotes } from "../utils/mergeNotes";
import { getFetcher, putFetcher } from "../utils/fetcher";
import type { NotesApiResponse } from "@shared/types/note";

export const useSyncNotes = () => {
  const { data: notesSynced, mutate: mutateNotesSynced } = useSWRImmutable<
    Note[]
  >("notes-synced", () => localFetcher("synced"), { refreshWhenOffline: true });
  const { data: notesUpdated, mutate: mutateNotesUpdated } = useSWR<Note[]>(
    "notes-updated",
    null,
  );

  const hasSynced = notesSynced && notesSynced.length > 0;
  const hasUpdated = notesUpdated && notesUpdated.length > 0;
  const updatedAfter = hasSynced ? notesSynced[0].updatedAt : undefined;

  useSWR<NotesApiResponse>(
    "notes-sync",
    async () =>
      hasUpdated
        ? await putFetcher(updatedAfter, notesUpdated)
        : await getFetcher(updatedAfter),
    {
      onSuccess: async (apiResponse) => {
        const { serverTime, notes: notesFromServer, updates } = apiResponse;

        // 最終同期時刻（サーバー側でのDate.now()）を記録
        mutate<number>("last-synced-time", serverTime);

        // サーバーからのnotesをローカルのsyncedに保存・キャッシュ更新
        await db.synced.bulkPut(notesFromServer);
        const notesSyncedNew = mergeNotes(notesSynced, notesFromServer);
        mutateNotesSynced<Note[]>(notesSyncedNew, false);

        // サーバーへの更新が成功したものをローカルのupdatedから削除
        const successfulUpdates = new Map<number, number>();
        updates?.forEach((update) => {
          if ("err" in update) {
            console.error(
              "Failed to sync note with id " + update.id,
              update.err,
            );
          } else if ("updatedAt" in update) {
            successfulUpdates.set(update.id, update.updatedAt);
          }
        });
        successfulUpdates.forEach(async (updatedAt, id) => {
          const note = await db.updated.get(id);
          if (note && note.updatedAt === updatedAt) {
            await db.updated.delete(id);
          }
        });
        if (successfulUpdates.size > 0) mutate("notes-updated-saved");

        // ローカルのupdatedのキャッシュからサーバーへの更新が成功したものを削除
        mutateNotesUpdated<Note[]>(async (notesLocalUpdates) => {
          return notesLocalUpdates?.filter(({ id, updatedAt }) => {
            const successfulUpdatedAt = successfulUpdates.get(id);
            return successfulUpdatedAt !== updatedAt;
          });
        });
      },
      refreshInterval: 2000,
    },
  );
};

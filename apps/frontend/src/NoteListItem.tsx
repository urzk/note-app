import { memo, useMemo } from "react";
import useSWR from "swr";

import { getDateOrTime } from "@shared/utils/datetime";

export const NoteListItem = memo(
  ({
    id,
    title,
    selected,
    updatedAt,
    isSynced,
  }: {
    id: number;
    title: string;
    selected: boolean;
    updatedAt: number;
    isSynced: boolean;
  }) => {
    const { mutate } = useSWR<number>("selected-note-id", null);
    const dateOrTime = useMemo(() => getDateOrTime(updatedAt), [updatedAt]); // TODO: 日付変更時の更新

    return (
      <li className="px-3">
        <div
          className={
            "px-3 py-1 rounded-md" + (selected && " bg-zinc-800 shadow-lg")
          }
          onClick={() => mutate(id)}
        >
          <div>
            <h2>{!title ? "無題" : title}</h2>
          </div>
          <div className="flex items-end justify-between">
            <small>
              {isSynced && "[Synced]"}
              {dateOrTime}
            </small>
            <small>タグ</small>
          </div>
        </div>
      </li>
    );
  },
);

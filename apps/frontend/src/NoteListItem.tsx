import { memo, useMemo } from "react";
import { getDateOrTime } from "@shared/utils/datetime";
import useSWR from "swr";

export const NoteListItem = memo(
  ({
    id,
    title,
    selected,
    updatedAt,
  }: {
    id: number;
    title: string;
    selected: boolean;
    updatedAt: number;
  }) => {
    const { mutate } = useSWR<number>("selected-note-id", null);
    const dateOtTime = useMemo(() => getDateOrTime(updatedAt), [updatedAt]); // TODO: 日付変更時の更新

    return (
      <li className="px-3">
        <div
          className={
            "px-3 py-1 rounded-md" + (selected && " bg-zinc-800 shadow-lg")
          }
          onClick={() => mutate(id)}
        >
          <div>
            <h2>{title}</h2>
          </div>
          <div>
            <small>{dateOtTime}</small>
          </div>
        </div>
      </li>
    );
  },
);

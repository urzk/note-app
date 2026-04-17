import { memo, useMemo } from "react";
import useSWR from "swr";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import type { Note } from "@shared/types/note";
import { getDateOrTime } from "@shared/utils/datetime";

export const NoteListItem = memo(
  ({
    note,
    selected,
    state,
  }: {
    note: Note;
    selected: boolean;
    state: "synced" | "saved" | "none";
  }) => {
    const { id, title, updatedAt } = note;
    const { mutate } = useSWR<number>("selected-note-id", null);
    const dateOrTime = useMemo(() => getDateOrTime(updatedAt), [updatedAt]); // TODO: 日付変更時の更新

    return (
      <li className="px-3">
        <div
          className={
            "px-3 py-1 rounded-md" + (selected ? " bg-zinc-800 shadow-lg" : "")
          }
          onClick={() => mutate(id)}
        >
          <div>
            <h2 className={"line-clamp-1" + (selected ? " text-zinc-100" : "")}>
              {!title ? "無題" : title}
            </h2>
          </div>
          <div className="flex items-end justify-between">
            <small>
              {state === "synced" && (
                <FontAwesomeIcon icon={faRotate} size="xs" />
              )}
              {state === "saved" && (
                <FontAwesomeIcon icon={faDownload} size="xs" />
              )}
              {state === "none" && <div className="inline-block w-3 h-1" />}
              &nbsp;{dateOrTime}
            </small>
          </div>
        </div>
      </li>
    );
  },
);

import { useMemo } from "react";
import { getDateOrTime } from "@shared/utils/datetime";

export const NoteListItem = ({
  id,
  title,
  updatedAt,
}: {
  id: number;
  title: string;
  updatedAt: number;
}) => {
  const dateOtTime = useMemo(() => getDateOrTime(updatedAt), [updatedAt]); // TODO: 日付変更時の更新

  return (
    <li className="px-3" key={id}>
      <div className="px-3 py-1 rounded-md hover:bg-zinc-800 hover:shadow-lg">
        <div>
          <h2>{title}</h2>
        </div>
        <div>
          <small>{dateOtTime}</small>
        </div>
      </div>
    </li>
  );
};

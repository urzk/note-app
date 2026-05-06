import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { v7 as uuidv7 } from "uuid";

import { useSetNote } from "src/hooks/useSetNote";

export const SidebarHeader = () => {
  const setNote = useSetNote();

  return (
    <div className="border-b border-zinc-800 flex flex-row-reverse p-1">
      <button
        className="hover:bg-zinc-800 p-1 rounded-sm"
        onClick={() =>
          setNote({
            id: uuidv7(),
            title: "",
            content: "",
            updatedAt: Date.now(),
            isDeleted: false,
          })
        }
      >
        <FontAwesomeIcon icon={faPenToSquare} size="lg" />
      </button>
    </div>
  );
};

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

export const SidebarHeader = () => {
  return (
    <div className="border-b border-zinc-800 flex flex-row-reverse p-2">
      <FontAwesomeIcon icon={faPenToSquare} size="lg" />
    </div>
  );
};

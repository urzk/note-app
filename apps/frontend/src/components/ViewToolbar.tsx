import {
  SplitscreenLeft,
  SplitscreenRight,
  SplitscreenTop,
  SplitscreenBottom,
} from "./icons/splitscreen";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare as faSquareSolid } from "@fortawesome/free-solid-svg-icons";
import { faSquare as faSquareRegular } from "@fortawesome/free-regular-svg-icons";

export const ViewToolbar = () => {
  return (
    <ul className="flex items-center px-1 py-0.5">
      <li className="hover:bg-zinc-800">
        <button>
          <FontAwesomeIcon icon={faSquareRegular} size="1x" />
        </button>
      </li>
      <li className="hover:bg-zinc-800">
        <button>
          <FontAwesomeIcon icon={faSquareSolid} size="1x" />
        </button>
      </li>
      <li className="w-1 text-center">|</li>
      <li className="hover:bg-zinc-800">
        <button>
          <SplitscreenRight />
        </button>
      </li>
      <li className="hover:bg-zinc-800">
        <button>
          <SplitscreenTop />
        </button>
      </li>
      <li className="hover:bg-zinc-800">
        <button>
          <SplitscreenBottom />
        </button>
      </li>
      <li className="hover:bg-zinc-800">
        <button>
          <SplitscreenLeft />
        </button>
      </li>
    </ul>
  );
};

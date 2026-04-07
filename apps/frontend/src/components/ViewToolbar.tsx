import {
  SplitscreenLeft,
  SplitscreenRight,
  SplitscreenTop,
  SplitscreenBottom,
} from "./icons/splitscreen";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare as faSquareSolid } from "@fortawesome/free-solid-svg-icons";
import { faSquare as faSquareRegular } from "@fortawesome/free-regular-svg-icons";

export const ViewToolbar = ({ setRatio, setPosition }) => {
  return (
    <ul className="flex items-center px-1 py-0.5">
      <li className="hover:bg-zinc-800">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setRatio((ratio) => (ratio <= 0 || e.shiftKey ? 0 : ratio - 1));
          }}
        >
          <FontAwesomeIcon icon={faSquareRegular} size="1x" />
        </button>
      </li>
      <li className="hover:bg-zinc-800">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setRatio((ratio) => (ratio >= 12 || e.shiftKey ? 12 : ratio + 1));
          }}
        >
          <FontAwesomeIcon icon={faSquareSolid} size="1x" />
        </button>
      </li>
      <li className="w-1 text-center">|</li>
      <li className="hover:bg-zinc-800">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPosition(0);
            setRatio(6);
          }}
        >
          <SplitscreenRight />
        </button>
      </li>
      <li className="hover:bg-zinc-800">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPosition(1);
            setRatio(6);
          }}
        >
          <SplitscreenTop />
        </button>
      </li>
      <li className="hover:bg-zinc-800">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPosition(2);
            setRatio(6);
          }}
        >
          <SplitscreenLeft />
        </button>
      </li>
      <li className="hover:bg-zinc-800">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPosition(3);
            setRatio(6);
          }}
        >
          <SplitscreenBottom />
        </button>
      </li>
    </ul>
  );
};

import { memo } from "react";
import { type RefObject } from "react";
import type {
  ICommand,
  TextAreaCommandOrchestrator,
} from "@uiw/react-md-editor";

export const MdToolbar = memo(
  ({
    commands,
    orchestratorRef,
  }: {
    commands: ICommand<string>[];
    orchestratorRef: RefObject<null | TextAreaCommandOrchestrator>;
  }) => {
    return (
      <ul className="flex items-center px-1 py-0.5">
        {commands.map((command, idx) => {
          if (command.keyCommand === "divider") {
            return (
              <li key={idx} className="w-1 text-center">
                |
              </li>
            );
          }
          return (
            <li key={idx} className="hover:bg-zinc-800">
              <button
                className="p-1"
                {...command.buttonProps}
                onClick={(e) => {
                  e.stopPropagation();
                  orchestratorRef.current?.executeCommand(command);
                }}
              >
                {command.icon}
              </button>
              {Array.isArray(command.children)}
            </li>
          );
        })}
      </ul>
    );
  },
);

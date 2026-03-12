import React, { useEffect } from "react";
import {
  handleKeyDown,
  shortcuts,
  TextAreaCommandOrchestrator,
  getCommands,
} from "@uiw/react-md-editor";

export const Editor = () => {
  const [value, setValue] = React.useState("**Hello world!!!**");
  const textareaRef = React.useRef<null | HTMLTextAreaElement>(null);
  const orchestratorRef = React.useRef<null | TextAreaCommandOrchestrator>(
    null,
  );

  useEffect(() => {
    if (textareaRef.current) {
      orchestratorRef.current = new TextAreaCommandOrchestrator(
        textareaRef.current,
      );
    }
  }, []);

  const onKeyDown = (e) => {
    handleKeyDown(e, 2, false);
    if (orchestratorRef.current) {
      shortcuts(e, getCommands(), orchestratorRef.current);
    }
  };
  console.log(getCommands()[0]);
  const commands = getCommands();
  console.log(commands.length);

  return (
    <>
      <ul className="border-b border-zinc-800 px-1 flex">
        {commands.map((command) => (
          <li>
            <button
              className="p-1"
              onClick={(e) => {
                e.stopPropagation();
                orchestratorRef.current?.executeCommand(command);
              }}
            >
              {command.icon}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex w-full h-screen overflow-auto">
        <textarea
          className="w-1/2 p-4 overflow-auto resize-none outline-0"
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="w-1/2 border-l border-zinc-800">ねこ</div>
      </div>
    </>
  );
};

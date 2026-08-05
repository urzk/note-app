import "./style.css";

import { SWRConfig } from "swr";

import { EditorWrapper } from "./components/EditorWrapper";
import { NoteList } from "./components/NoteList";
import { SidebarHeader } from "./components/SidebarHeader";

const App = () => {
  return (
    <SWRConfig value={{ compare: Object.is }}>
      <div className="flex h-screen overflow-hidden">
        <div className="flex flex-col shrink-0 w-3xs border-r border-zinc-800">
          <SidebarHeader />
          <NoteList />
        </div>
        <EditorWrapper />
      </div>
    </SWRConfig>
  );
};

export default App;

import "./style.css";
import "katex/dist/katex.min.css";

import { Editor } from "./components/Editor";
import { NoteList } from "./components/NoteList";

function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-col shrink-0 w-3xs border-r border-zinc-800">
        <div className="bg-gray-800 h-8 text-center">header</div>
        <NoteList />
      </div>
      <Editor />
    </div>
  );
}

export default App;

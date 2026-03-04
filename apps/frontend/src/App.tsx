import { useState, useEffect } from "react";
import "./style.css";

import { useFetchedServerNotesData, useFetchNotesData } from "./hooks/fetch";
import MDEditor from "@uiw/react-md-editor";

import { NoteListItem } from "./NoteListItem";

function App() {
  const { data } = useFetchedServerNotesData();
  useFetchNotesData();
  useEffect(() => console.log(data));
  const [value, setValue] = useState<string | undefined>("");
  if (data) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="w-3xs flex flex-col">
          <ul className="flex-1 overflow-y-auto">
            {data.notes.map((note) => (
              <NoteListItem
                id={note.id}
                title={note.title}
                updatedAt={note.updatedAt}
              />
            ))}
          </ul>
        </div>
        <div className="grow">
          <MDEditor height={500} value={value} onChange={setValue} />
          {/* TODO: markdownパース処理をWeb Workerにやらせる */}
        </div>
      </div>
    );
  }
}

export default App;

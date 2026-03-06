import { useState, useEffect } from "react";
import "./style.css";

import { useFetchedServerNotesData, useFetchNotesData } from "./hooks/fetch";
import MDEditor from "@uiw/react-md-editor";
import useSWR from "swr";

import { NoteListItem } from "./NoteListItem";

function App() {
  const { data: selectedNoteId } = useSWR<number>("selected-note-id", null);
  const { data } = useFetchedServerNotesData();
  useFetchNotesData();
  useEffect(() => console.log(data));
  const [value, setValue] = useState<string | undefined>("");
  if (data) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="flex flex-col w-3xs">
          <div className="bg-gray-800 h-8 text-center">header</div>
          <ul className="flex-1 overflow-y-auto py-3">
            {data.notes.map((note) => (
              <NoteListItem
                id={note.id}
                selected={note.id === selectedNoteId}
                title={note.title}
                updatedAt={note.updatedAt}
                key={note.id}
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

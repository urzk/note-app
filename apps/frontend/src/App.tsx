import { useState, useEffect } from "react";
import "./style.css";

import { useFetchedServerNotesData, useFetchNotesData } from "./hooks/fetch";
import MDEditor from "@uiw/react-md-editor";

function App() {
  const { data } = useFetchedServerNotesData();
  useFetchNotesData();
  useEffect(() => console.log(data));
  const [value, setValue] = useState<string | undefined>("");
  if (data) {
    return (
      <div className="flex">
        <div className="w-3xs">
          {data.notes.map((note) => (
            <div key={note.id}>{note.title}</div>
          ))}
        </div>
        <div className="grow">
          <MDEditor height={1000} value={value} onChange={setValue} />
          {/* TODO: markdownパース処理をWeb Workerにやらせる */}
        </div>
      </div>
    );
  }
}

export default App;

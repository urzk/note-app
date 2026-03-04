import { useEffect } from "react";
import "./style.css";

import { useFetchedServerNotesData, useFetchNotesData } from "./hooks/fetch";

function App() {
  const { data } = useFetchedServerNotesData();
  useFetchNotesData();
  useEffect(() => console.log(data));
  if (data) {
    return (
      <div className="flex">
        <div className="w-3xs">
          {data.notes.map((note) => (
            <div key={note.id}>{note.title}</div>
          ))}
        </div>
        <div className="grow">にゃーん</div>
      </div>
    );
  }
}

export default App;

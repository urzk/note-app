import { useEffect } from "react";
import "./style.css";

import { useFetchedServerNotesData, useFetchNotesData } from "./hooks/fetch";

function App() {
  const { data } = useFetchedServerNotesData();
  useFetchNotesData();
  useEffect(() => console.log(data));

  return <div className="text-3xl font-bold underline">にゃーん</div>;
}

export default App;

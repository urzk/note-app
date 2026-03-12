import { useEffect } from "react";
import "./style.css";

import { useSyncNotesData } from "./hooks/useSyncNotesData";
import MDEditor from "@uiw/react-md-editor";
import useSWR from "swr";

import { NoteListItem } from "./NoteListItem";
import { useNote } from "./hooks/useNote";
import type { Note } from "@shared/types/note";
import { Editor } from "./Editor";

function App() {
  const { data: selectedNoteId } = useSWR<number>("selected-note-id", null);
  const { data: notesUpdated } = useSWR<Note[]>("notes-updated", null);
  const { data: notesSynced } = useSyncNotesData("notes-synced");
  const updatedIds = new Set(
    notesUpdated ? notesUpdated.map((note) => note.id) : [],
  );
  useEffect(() => console.log(notesSynced));
  const { note, setNote } = useNote(selectedNoteId);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-col w-3xs border-r border-zinc-800">
        <div className="bg-gray-800 h-8 text-center">header</div>
        <ul className="flex-1 overflow-y-auto py-3">
          {notesUpdated &&
            notesUpdated.map((note) => (
              <NoteListItem
                id={note.id}
                isSynced={false}
                selected={note.id === selectedNoteId}
                title={note.title}
                updatedAt={note.updatedAt}
                key={note.id}
              />
            ))}
          {notesSynced &&
            notesSynced.notes.map(
              (note) =>
                !updatedIds.has(note.id) && (
                  <NoteListItem
                    id={note.id}
                    isSynced={true}
                    selected={note.id === selectedNoteId}
                    title={note.title}
                    updatedAt={note.updatedAt}
                    key={note.id}
                  />
                ),
            )}
        </ul>
      </div>
      <div className="flex flex-col grow">
        {/*
          <MDEditor
            height={500}
            value={note?.content}
            onChange={(content) =>
              setNote({
                id: note?.id,
                title: note?.title,
                updatedAt: note?.updatedAt,
                content,
              })
            }
          />
        */}
        <Editor />
        {/* TODO: markdownパース処理をWeb Workerにやらせる */}
      </div>
    </div>
  );
}

export default App;

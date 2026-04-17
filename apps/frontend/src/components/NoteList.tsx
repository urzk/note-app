import useSWR from "swr";

import type { Note } from "@shared/types/note";
import { useSyncNotes } from "../hooks/useSyncNotes";
import { useSaveNotes } from "src/hooks/useSaveNotes";
import { NoteListItem } from "./NoteListItem";

export const NoteList = () => {
  const { data: selectedNoteId } = useSWR<number>("selected-note-id", null);
  const { data: notesUpdated } = useSWR<Note[]>("notes-updated", null);
  const { data: notesSynced } = useSWR<Note[]>("notes-synced", null);
  useSyncNotes();
  const { isSaved } = useSaveNotes();

  const updatedIds = new Set(
    notesUpdated ? notesUpdated.map((note) => note.id) : [],
  );

  return (
    <ul className="flex-1 overflow-y-auto py-3">
      {notesUpdated &&
        notesUpdated.map((note) => (
          <NoteListItem
            key={note.id}
            note={note}
            selected={note.id === selectedNoteId}
            state={isSaved(note) ? "saved" : "none"}
          />
        ))}
      {notesSynced &&
        notesSynced.map(
          (note) =>
            !updatedIds.has(note.id) && (
              <NoteListItem
                key={note.id}
                note={note}
                selected={note.id === selectedNoteId}
                state="synced"
              />
            ),
        )}
    </ul>
  );
};

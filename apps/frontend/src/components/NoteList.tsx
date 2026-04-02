import useSWR from "swr";

import type { Note, NotesApiResponse } from "@shared/types/note";
import { useSyncNotesData } from "../hooks/useSyncNotesData";
import { NoteListItem } from "./NoteListItem";

export const NoteList = () => {
  const { data: selectedNoteId } = useSWR<number>("selected-note-id", null);
  const { data: notesUpdated } = useSWR<Note[]>("notes-updated", null);
  const { data: notesSynced } = useSWR<NotesApiResponse>("notes-synced", null);
  useSyncNotesData();

  const updatedIds = new Set(
    notesUpdated ? notesUpdated.map((note) => note.id) : [],
  );

  return (
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
  );
};

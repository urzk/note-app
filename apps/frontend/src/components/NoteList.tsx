import useSWR from "swr";
import { useAtomValue } from "jotai";
import { selectedNoteIdAtom } from "src/jotai/atoms";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import type { Note } from "@shared/types/note";
import { useSyncNotes } from "../hooks/useSyncNotes";
import { useSaveNotes } from "src/hooks/useSaveNotes";
import { NoteListItem } from "./NoteListItem";

export const NoteList = () => {
  const selectedNoteId = useAtomValue(selectedNoteIdAtom);
  const { data: notesUpdated } = useSWR<Note[]>("notes-updated", null);
  const { data: notesSynced } = useSWR<Note[]>("notes-synced", null);
  const { isSaved } = useSaveNotes();
  useSyncNotes();

  const updatedIds = new Set(
    notesUpdated ? notesUpdated.map((note) => note.id) : [],
  );

  const [animationParent] = useAutoAnimate();

  return (
    <ul ref={animationParent} className="flex-1 overflow-y-auto py-3">
      {notesUpdated &&
        notesUpdated.map(
          (note) =>
            !note.isDeleted && (
              <NoteListItem
                key={note.id}
                note={note}
                selected={note.id === selectedNoteId}
                state={isSaved(note) ? "saved" : "unsaved"}
              />
            ),
        )}
      {notesSynced &&
        notesSynced.map(
          (note) =>
            !updatedIds.has(note.id) &&
            !note.isDeleted && (
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

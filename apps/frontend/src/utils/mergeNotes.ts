import type { NotesApi } from "@shared/types/note";

export const mergeNotes = (current: NotesApi, updated: NotesApi): NotesApi => {
  if (current.notes.length == 0) {
    return updated;
  } else if (updated.notes.length == 0) {
    return { serverTime: updated.serverTime, notes: current.notes };
  }
  const updatedIds: number[] = [];
  updated.notes.forEach((note) => {
    updatedIds.push(note.id);
  });
  current.notes.forEach((note) => {
    if (!(note.id in updatedIds)) {
      updated.notes.push(note);
    }
  });
  return updated;
};

import type { NotesApi } from "@shared/types/note";

export const mergeNotes = (current: NotesApi, updated: NotesApi): NotesApi => {
  if (current.notes.length == 0) {
    return updated;
  } else if (updated.notes.length == 0) {
    return { serverTime: updated.serverTime, notes: current.notes };
  }
  const updatedIds = new Set<number>();
  updated.notes.forEach((note) => {
    updatedIds.add(note.id);
  });
  current.notes.forEach((note) => {
    if (!updatedIds.has(note.id)) {
      updated.notes.push(note);
    }
  });
  return updated;
};

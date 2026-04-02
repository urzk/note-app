import type { NotesApiResponse } from "@shared/types/note";

export const mergeNotes = (
  current: NotesApiResponse,
  updated: NotesApiResponse,
): NotesApiResponse => {
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

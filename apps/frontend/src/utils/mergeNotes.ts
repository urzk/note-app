import type { Note } from "@shared/types/note";

export const mergeNotes = (current: Note[], updated: Note[]): Note[] => {
  if (current.length == 0) {
    return updated;
  } else if (updated.length == 0) {
    return current;
  }
  if (updated[updated.length - 1].updatedAt < current[0].updatedAt) {
    const err = new Error("time paradox");
    console.error(err);
    throw err;
  }
  const updatedIds = new Set<number>();
  updated.forEach((note) => {
    updatedIds.add(note.id);
  });
  const merged = [...updated];
  current.forEach((note) => {
    if (!updatedIds.has(note.id)) {
      merged.push(note);
    }
  });
  return merged;
};

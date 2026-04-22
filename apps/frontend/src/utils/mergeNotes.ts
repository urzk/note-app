import type { Note } from "@shared/types/note";

export const mergeNotes = (
  current: Note[] | undefined,
  updated: Note[],
): Note[] => {
  if (!current || current.length == 0) {
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
  const merged = [
    ...updated,
    ...current.filter((note) => !updatedIds.has(note.id)),
  ];
  return merged;
};

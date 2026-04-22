import type { Note } from "@shared/types/note.js";
import { putNoteQuery } from "./putNoteQuery.js";
import type { PutResponse } from "@shared/types/note.js";

export const putNotes = async (notes: Note[]) => {
  const promises = notes
    .map(async (note): Promise<PutResponse> => {
      try {
        return await putNoteQuery(note);
      } catch (err) {
        console.error(`Error updating note with id ${note.id}:`, err);
        return { id: note.id, err };
      }
    })
    .reverse();
  return await Promise.all(promises);
};

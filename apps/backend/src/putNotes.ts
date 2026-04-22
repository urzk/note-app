import type { Note } from "@shared/types/note.js";
import { putNoteQuery } from "./putNoteQuery.js";
import type { PutResponse } from "@shared/types/note.js";

export const putNotes = async (notes: Note[]) => {
  const promises = notes
    .map(async (note): Promise<PutResponse> => {
      return await putNoteQuery(note);
    })
    .reverse();
  return await Promise.all(promises);
};

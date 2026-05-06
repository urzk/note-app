import { useNoteValue } from "./useNoteValue";
import { useSetNote } from "./useSetNote";
import type { Note } from "@shared/types/note";

export const useNote = (
  id: string | undefined,
): {
  note: Note | undefined;
  setNote: (note: Note) => void;
} => {
  const note = useNoteValue(id);
  const setNote = useSetNote();

  return { note, setNote };
};

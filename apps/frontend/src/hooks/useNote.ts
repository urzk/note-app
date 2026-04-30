import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

import type { Note } from "@shared/types/note";

export const useNote = (
  id: string | undefined,
): {
  note: Note | undefined;
  setNote: (note: Note) => void;
} => {
  const { data: notesUpdated, mutate } = useSWR<Note[]>("notes-updated", null);
  const { data: notesSynced } = useSWR<Note[]>("notes-synced", null);

  // 編集の状態("editing" or "idle")を管理するためのstateとuseEffect
  const { mutate: setNotesState } = useSWR<"editing" | "idle">(
    "notes-state",
    null,
    { fallbackData: "idle" },
  );
  const [notesUpdatedAt, setNotesUpdatedAt] = useState<number>(0);
  const lastUpdatedRef = useRef<number>(0);
  useEffect(() => {
    if (notesUpdatedAt) setNotesState("editing");
    const timeStamp = notesUpdatedAt;
    lastUpdatedRef.current = timeStamp;
    const timeoutId = setTimeout(() => {
      if (lastUpdatedRef.current === timeStamp) {
        setNotesState("idle");
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [notesUpdatedAt]);

  const setNote = (note: Note) => {
    setNotesUpdatedAt(note.updatedAt);
    mutate<Note[]>(
      (current = []) => [note, ...current.filter((n) => n.id !== note.id)],
      false,
    );
  };

  const note =
    id === undefined
      ? undefined
      : (notesUpdated?.find((n) => n.id === id) ??
        notesSynced?.find((n) => n.id === id));

  return { note, setNote };
};

import { atom } from "jotai";

export const notesUpdatedAtAtom = atom<number>(0);

export const editorStateAtom = atom<"editing" | "idle">("idle");

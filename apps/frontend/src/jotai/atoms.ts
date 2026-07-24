import { atom } from "jotai";

export const notesUpdatedAtAtom = atom<number>(0);

export const editorStateAtom = atom<"editing" | "idle">("idle");

export const selectedNoteIdAtom = atom<string | undefined>(undefined);

export const textSelectionLengthAtom = atom<number>(0);

export const editorViewStateAtom = atom<"editor" | "preview">("editor");

import { atom } from "jotai";

export const notesUpdatedAtAtom = atom<number>(0);

export const editorStateAtom = atom<"editing" | "idle">("idle");

export const selectedNoteIdAtom = atom<string | undefined>(undefined);

export const editorTextSelectionLengthAtom = atom<number>(0);

export const editorTextLengthAtom = atom<number>(0);

export const editorViewStateAtom = atom<"editor" | "milkdown">("milkdown");

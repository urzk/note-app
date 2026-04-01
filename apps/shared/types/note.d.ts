export type Note = {
  id: number;
  title: string;
  content: string;
  updatedAt: number;
  isDeleted: boolean;
};

export type NotesApiResponse = {
  serverTime: number;
  notes: Note[];
};

export type NotesSyncApiResponse = NotesApiResponse & {
  updateError?: unknown;
};

export type NotesErrorResponse = { readError: unknown };

export type NotesSyncErrorResponse = NotesErrorResponse & {
  updateError?: unknown;
};

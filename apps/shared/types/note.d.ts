export type Note = {
  id: number;
  title: string;
  content: string;
  updatedAt: number;
  isDeleted: boolean;
};

export type PutResponse =
  | { id: number; updatedAt: number }
  | { id: number; err: unknown };

export type NotesApiResponse = {
  serverTime: number;
  notes: Note[];
  updates?: PutResponse[];
};

export type NotesErrorResponse = {
  readError: unknown;
  updates?: PutResponse[];
};

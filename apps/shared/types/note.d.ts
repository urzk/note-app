export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  isDeleted: boolean;
};

export type PutResponse =
  | { id: string; updatedAt: number }
  | { id: string; err: unknown };

export type NotesApiResponse = {
  serverTime: number;
  notes: Note[];
  updates?: PutResponse[];
};

export type NotesErrorResponse = {
  readError: unknown;
  updates?: PutResponse[];
};

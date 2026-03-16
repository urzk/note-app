export type Note = {
  id: number;
  title: string;
  content: string;
  updatedAt: number;
  isDeleted: boolean;
};

export type NotesApi = {
  serverTime: number;
  notes: Note[];
};

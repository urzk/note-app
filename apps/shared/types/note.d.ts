export type Note = {
  id: number;
  userId: number | null; // TODO:
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
};

export type NotesApi = {
  serverTime: number;
  notes: Note[];
};

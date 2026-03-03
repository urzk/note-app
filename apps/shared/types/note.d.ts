export type Note = {
  id: number;
  userId: number | null; // TODO:
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
};

export type NotesApi = {
  serverTime: number;
  notes: Note[];
};

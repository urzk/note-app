export type Note = {
  id: number;
  userId: number | null; // TODO:
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
};

export type NoteDB = {
  id: number;
  user_id: number | null; // TODO:
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
};

export type NotesApi = {
  serverTime: number;
  notes: Note[];
};

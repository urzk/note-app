import type { RowDataPacket } from "mysql2";
import type { Note, NotesApiResponse } from "@shared/types/note.js";
import { pool } from "./db.js";

export interface NoteDB extends RowDataPacket {
  id: number;
  user_id: number | null; // TODO:
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: number;
}

export const getNotes = async (updatedAfter: Date | undefined) => {
  let query = "SELECT * FROM notes WHERE user_id IS NULL";
  if (updatedAfter && !isNaN(updatedAfter.getTime())) {
    query += " AND updated_at > ?";
  }
  query += " ORDER BY updated_at DESC";
  const serverTime = Date.now();
  const [notesDB] = await pool.query<NoteDB[]>(query, [updatedAfter]);
  const notes: Note[] = notesDB.map(
    ({ id, title, content, updated_at, is_deleted }) => ({
      id,
      title,
      content,
      updatedAt: updated_at.getTime(),
      isDeleted: is_deleted == 1,
    }),
  );
  const notesResponse: NotesApiResponse = { serverTime, notes };
  return notesResponse;
};

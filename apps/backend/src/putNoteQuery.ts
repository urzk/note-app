import type { Note } from "@shared/types/note.js";
import { pool } from "./db.js";
import type { PutResponse } from "@shared/types/note.js";

export const putNoteQuery = async (note: Note): Promise<PutResponse> => {
  const { id, title, content, updatedAt: clientUpdatedAt, isDeleted } = note;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      "UPDATE notes SET title = ?, content = ?, updated_at = NOW(3), is_deleted = ? WHERE id = ?",
      [title, content, isDeleted, id],
    );
    await conn.commit();
    return { id, updatedAt: clientUpdatedAt };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

import type { Note } from "@shared/types/note.js";
import { pool } from "./db.js";
import { getNote } from "./getNotes.js";
import { isUuid } from "@shared/utils/isUuid.js";
import type { PutResponse } from "@shared/types/note.js";

export const putNoteQuery = async (note: Note): Promise<PutResponse> => {
  const { id, title, content, updatedAt: clientUpdatedAt, isDeleted } = note;
  if (!isUuid(id)) {
    throw new Error(`Invalid UUID id: ${id}`);
  }
  const notePrev = await getNote(id);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    if (notePrev) {
      await conn.query(
        "UPDATE notes SET title = ?, content = ?, updated_at = NOW(3), is_deleted = ? WHERE id = UUID_TO_BIN(?)",
        [title, content, isDeleted, id],
      );
    } else {
      await conn.query(
        "INSERT INTO notes (id, user_id, title, content, updated_at, is_deleted) VALUES (UUID_TO_BIN(?), ?, ?, ?, NOW(3), ?)",
        [id, null, title, content, isDeleted],
      );
    }
    await conn.commit();
    return { id, updatedAt: clientUpdatedAt };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

import type { PoolConnection } from "mysql2/promise";
import type { Note } from "@shared/types/note.js";

export const putNoteQuery = async (conn: PoolConnection, note: Note) => {
  await conn.query(
    "UPDATE notes SET title = ?, content = ?, updated_at = NOW(4), is_deleted = ? WHERE id = ?",
    [note.title, note.content, note.isDeleted, note.id],
  );
};

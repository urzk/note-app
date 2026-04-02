import type { Note } from "@shared/types/note.js";
import { pool } from "./db.js";
import { putNoteQuery } from "./putNoteQuery.js";

export const putNotes = async (notes: Note[]) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const note of [...notes].reverse()) {
      await putNoteQuery(conn, note);
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

import express from "express";
import type { Request, Response } from "express";
import { pool } from "./db.js";
import cors from "cors";
import type { Note, NotesApi } from "@shared/types/note.js";
import type { RowDataPacket } from "mysql2";

export interface NoteDB extends RowDataPacket {
  id: number;
  user_id: number | null; // TODO:
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: number;
}

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get(
  "/v1/notes",
  async (
    req: Request<any, any, any, { updatedAfter?: string }>,
    res: Response<NotesApi | { err: unknown }>,
  ) => {
    console.log(req.query.updatedAfter);
    const updatedAfter =
      typeof req.query.updatedAfter === "string"
        ? new Date(Number(req.query.updatedAfter))
        : undefined;
    const serverTime = Date.now();
    try {
      let query = "SELECT * FROM notes WHERE user_id IS NULL";
      if (updatedAfter && !isNaN(updatedAfter.getTime())) {
        query += " AND updated_at > ?";
      }
      query += " ORDER BY updated_at DESC";
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
      const notesApiResponse: NotesApi = { serverTime, notes };
      console.log(notesApiResponse);
      res.json(notesApiResponse);
    } catch (err) {
      console.error(err);
      res.status(500).json({ err });
    }
  },
);

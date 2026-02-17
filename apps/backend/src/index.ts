import express from "express";
import { Request, Response } from "express";
import { pool } from "./db";
import cors from "cors";
import type { Note, NoteDB, NotesApi } from "@shared/types/note";

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
    res: Response<NotesApi>,
  ) => {
    console.log(req.query.updatedAfter);
    const updatedAfter =
      typeof req.query.updatedAfter === "string"
        ? new Date(Number(req.query.updatedAfter))
        : undefined;
    const serverTime = Date.now();
    try {
      let query = "SELECT * FROM notes";
      if (updatedAfter && !isNaN(updatedAfter.getTime())) {
        query += " WHERE updated_at > ?";
      }
      const [notesDB] = await pool.query<NoteDB[]>(query, [updatedAfter]);
      const notes: Note[] = notesDB.map(
        ({
          id,
          user_id,
          title,
          content,
          created_at,
          updated_at,
          is_deleted,
        }) => ({
          id,
          userId: user_id,
          title,
          content,
          createdAt: created_at,
          updatedAt: updated_at,
          isDeleted: is_deleted,
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

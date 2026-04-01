import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import type { Note, NotesApi } from "@shared/types/note.js";
import { numberToDate } from "@shared/utils/datetime.js";
import { getNotes } from "./getNotes.js";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

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
    const updatedAfter = numberToDate(req.query.updatedAfter);
    try {
      const notesApiResponse = await getNotes(updatedAfter);
      console.log(notesApiResponse);
      res.json(notesApiResponse);
    } catch (err) {
      console.error(err);
      res.status(500).json({ err });
    }
  },
);

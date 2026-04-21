import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import type {
  Note,
  NotesApiResponse,
  NotesErrorResponse,
} from "@shared/types/note.js";
import { numberToDate } from "@shared/utils/datetime.js";
import { getNotes } from "./getNotes.js";
import { putNotes } from "./putNotes.js";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get(
  "/v1/notes",
  async (
    req: Request<{}, {}, {}, { updatedAfter?: string }>,
    res: Response<NotesApiResponse | NotesErrorResponse>,
  ) => {
    const updatedAfter = numberToDate(req.query.updatedAfter);
    try {
      const notesResponse = await getNotes(updatedAfter);
      res.json(notesResponse);
    } catch (err) {
      console.error("getNotes failed:", err);
      const readError = err;
      res.status(500).json({ readError });
    }
  },
);

app.put(
  "/v1/notes-sync",
  async (
    req: Request<{}, {}, { updatedAfter?: string; updatedNotes: Note[] }>,
    res: Response<NotesApiResponse | NotesErrorResponse>,
  ) => {
    const updatedAfter = numberToDate(req.body.updatedAfter);
    const updates = await putNotes(req.body.updatedNotes);
    try {
      const notesResponse = await getNotes(updatedAfter);
      const notesSyncResponse: NotesApiResponse = {
        updates,
        ...notesResponse,
      };
      res.json(notesSyncResponse);
    } catch (err) {
      console.error("getNotes failed:", err);
      res.status(500).json({ updates, readError: err });
    }
  },
);

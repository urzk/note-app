import axios from "axios";
import type { Note, NotesApi } from "@shared/types/note";

const origin = "http://localhost:3000";

const getPath = "/v1/notes";
const postPath = "/v1/notes/sync";
const getUrl = origin + getPath;
const postUrl = origin + postPath;

export const syncFetcher = async (
  current: NotesApi | undefined,
  updatedNotes: Note[] | undefined,
): Promise<NotesApi> => {
  try {
    if (updatedNotes && updatedNotes.length > 0) {
      const res = await axios.post<NotesApi>(postUrl, {
        updatedAfter: current?.serverTime,
        updatedNotes,
      });
      return res.data;
    } else {
      const res = await axios.get<NotesApi>(
        current?.serverTime
          ? getUrl + "?updatedAfter=" + current.serverTime
          : getUrl,
      );
      return res.data;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

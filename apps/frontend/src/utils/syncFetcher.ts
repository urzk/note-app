import axios from "axios";
import type {
  Note,
  NotesApiResponse,
  NotesSyncApiResponse,
} from "@shared/types/note";

const origin = "http://localhost:3000";

const getPath = "/v1/notes";
const putPath = "/v1/notes-sync";
const getUrl = origin + getPath;
const putUrl = origin + putPath;

export const syncFetcher = async (
  updatedAfter: number | undefined,
  updatedNotes: Note[] | undefined,
): Promise<NotesApiResponse | NotesSyncApiResponse> => {
  try {
    if (updatedNotes && updatedNotes.length > 0) {
      const res = await axios.put<NotesSyncApiResponse>(putUrl, {
        updatedAfter,
        updatedNotes,
      });
      return res.data;
    } else {
      const res = await axios.get<NotesApiResponse>(
        updatedAfter ? getUrl + "?updatedAfter=" + updatedAfter : getUrl,
      );
      return res.data;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

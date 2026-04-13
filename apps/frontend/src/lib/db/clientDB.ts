import { Dexie, type EntityTable } from "dexie";
import type { Note } from "@shared/types/note";

const db = new Dexie("Notes") as Dexie & {
  synced: EntityTable<Note, "id">;
  updated: EntityTable<Note, "id">;
};

db.version(1).stores({
  synced: "id, updatedAt",
  updated: "id, updatedAt",
});

export default db;

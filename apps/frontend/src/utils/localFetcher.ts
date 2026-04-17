import db from "src/lib/db/clientDB";

const localFetcher = async (key: "synced" | "updated") => {
  const notes = await db[key].orderBy("updatedAt").reverse().toArray();
  return notes;
};

export default localFetcher;

import express from "express";
import { pool } from "./db";
import cors from "cors";

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

app.get("/v1/notes", async (req, res) => {
  console.log(req.query.updatedAfter);
  const updatedAfter =
    typeof req.query.updatedAfter === "string"
      ? new Date(Number(req.query.updatedAfter))
      : undefined;
  const serverTime = Date.now();
  try {
    if (updatedAfter && !isNaN(updatedAfter.getTime())) {
      const [data] = await pool.query(
        "SELECT * FROM notes WHERE updated_at > ?",
        [updatedAfter],
      );
      console.log({ serverTime, data });
      res.json({ serverTime, data });
    } else {
      const [data] = await pool.query("SELECT * FROM notes");
      console.log({ serverTime, data });
      res.json({ serverTime, data });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
});

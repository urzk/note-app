import express from "express";
import { pool } from "./db";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("v1/users", async (req, res) => {
  const updated_after =
    typeof req.query.updated_after === "string"
      ? new Date(req.query.updated_after)
      : undefined;
  console.log(updated_after);
  try {
    if (updated_after && !isNaN(updated_after.getTime())) {
      const [rows] = await pool.query(
        "SELECT * FROM notes WHERE updated_at > ?",
        [updated_after],
      );
      res.json(rows);
    } else {
      const [rows] = await pool.query("SELECT * FROM notes");
      res.json(rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
});

import express from "express";
import dotenv from "dotenv";
dotenv.config();
import pool from "./db.js";
import authRouter from "./routes/auth.js";
import notesRouter from "./routes/notes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});



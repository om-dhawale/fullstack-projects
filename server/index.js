import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import pool from "./db.js";
import authRouter from "./routes/auth.js";
import notesRouter from "./routes/notes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. SILENCE FAVICON ERROR: Tells the browser there is no icon here
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 2. MIDDLEWARE
app.use(express.json());

// 3. CORS: Allow your local dev environment and your future deployed frontend
app.use(cors({
  origin: ["http://localhost:5173"], // Add your Render/Vercel frontend URL here later
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 4. ROUTES
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);

// Basic health check
app.get("/", (req, res) => res.send("API is running..."));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
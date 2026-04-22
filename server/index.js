import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import pool from "./db.js";
import authRouter from "./routes/auth.js";
import notesRouter from "./routes/notes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self' https://notesapp-backend-8w7t.onrender.com; img-src 'self' data:;");
  next();
});

// 2. The manual favicon handler
app.get('/favicon.ico', (req, res) => {
    res.status(204).attr('Content-Type', 'image/x-icon').end();
});

// 2. MIDDLEWARE
app.use(express.json());

// 3. CORS: Allow your local dev environment and your future deployed frontend
app.use(cors({
  origin: ["http://localhost:5173", "https://notesapp-backend-8w7t.onrender.com", "https://fullstack-projects-gamma.vercel.app/"], // Add your Render/Vercel frontend URL here later
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
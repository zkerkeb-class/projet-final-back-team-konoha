import express from 'express';
import './connect.js';
import cors from "cors";
import authRoutes from "./routes/auth.js";
import gameRoutes from "./routes/game.js"; 
import anecdoteRoutes from "./routes/anecdote.js";
import pollRoutes from "./routes/poll.js";
import guideRoutes from "./routes/guide.js";
import path from "path";

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());
app.use('/assets', express.static(path.join(process.cwd(), 'public/assets')));
app.use("/api", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/anecdotes", anecdoteRoutes);
app.use("/api/sondages", pollRoutes);
app.use("/api/guides", guideRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
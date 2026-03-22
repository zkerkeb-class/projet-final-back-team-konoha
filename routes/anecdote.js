import express from "express";
import anecdote from "../schema/anecdote.js";

const router = express.Router();
const limit = 5;

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const anecdotes = await anecdote.find({}).skip(skip).limit(limit);
    const total = await anecdote.countDocuments();

    res.json({
      page,
      limit,
      total,
      nbPages: Math.ceil(total / limit),
      data: anecdotes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/search', async (req, res) => {
  try {
    const {title,page=1} = req.query;
    const skip = (page - 1) * limit;
    const filter = {};
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    const anecdotes = await anecdote.find(filter).skip(skip).limit(limit);
    const total = await anecdote.countDocuments(filter);
    res.json({
      page: Number(page),
      limit:limit,
      total:total,
      nbPages: Math.ceil(total / limit),
      data: anecdotes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
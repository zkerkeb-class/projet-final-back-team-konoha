import express from "express";
import poll from "../schema/poll.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const limit = 5;

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const polls = await poll.find({}).skip(skip).limit(limit);
    const total = await poll.countDocuments();

    res.json({
      page,
      limit,
      total,
      nbPages: Math.ceil(total / limit),
      data: polls
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

    const polls = await poll.find(filter).skip(skip).limit(limit);
    const total = await poll.countDocuments(filter);
    res.json({
      page: Number(page),
      limit:limit,
      total:total,
      nbPages: Math.ceil(total / limit),
      data: polls
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post("/:id/vote", auth, async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const pollId = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Sondage introuvable" });

    if (poll.options[optionIndex] === undefined)
      return res.status(400).json({ message: "Option invalide" });

    poll.options[optionIndex].votes += 1;
    await poll.save();

    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
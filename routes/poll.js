import express from "express";
import poll from "../schema/poll.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const limit = 5;

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
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
    const polls = await poll.findById(req.params.id);
    if (!polls) {
      return res.status(404).json({ message: "Sondage introuvable" });
    }

    //nouveau
    if (polls.voters.includes(req.user.id)) {
      return res.status(403).json({ message: "Vous avez déjà voté" });
    }

    if (
      optionIndex === undefined ||
      optionIndex < 0 ||
      optionIndex >= polls.options.length
    ) {
      return res.status(400).json({ message: "Option invalide" });
    }

    polls.options[optionIndex].votes += 1;
    polls.voters.push(req.user.id); //nouveau
    await polls.save();
    res.json(polls);
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
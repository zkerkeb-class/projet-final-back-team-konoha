import express from "express";
import game from "../schema/game.js";

const router = express.Router();
const limit = 5;

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page)||1;
    const skip = (page-1)*limit;
    const games = await game.find({}).skip(skip).limit(limit);
    const total = await game.countDocuments();
    res.json({page:page,limit:limit,total:total,nbPages:Math.ceil(total/limit),data:games});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const {title,series,editor,studio,genre,platform,page=1} = req.query;
    const skip = (page - 1) * limit;
    const filter = {};
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (series) {
      filter.series = { $regex: series, $options: "i" };
    }
    if (editor) {
      filter.editor = { $regex: editor, $options: "i" };
    }
    if (studio) {
      filter.studio = { $regex: studio, $options: "i" };
    }
    if (genre) {
      filter.genres = { $in: [new RegExp(genre, "i")] };
    }
    if (platform) {
      filter.platforms = { $in: [new RegExp(platform, "i")] };
    }

    const games = await game.find(filter).skip(skip).limit(limit);
    const total = await game.countDocuments(filter);
    res.json({
      page: Number(page),
      limit:limit,
      total:total,
      nbPages: Math.ceil(total / limit),
      data: games
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const gameFound = await game.findById(req.params.id);
    if (!gameFound) {
      return res.status(404).json({ message: "Jeu non trouvé" });
    }
    res.json(gameFound);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
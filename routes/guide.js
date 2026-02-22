import express from "express";
import guide from "../schema/guide.js";

const router = express.Router();
const limit = 5;

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const guides = await guide.find({}).skip(skip).limit(limit);
    const total = await guide.countDocuments();

    res.json({
      page,
      limit,
      total,
      nbPages: Math.ceil(total / limit),
      data: guides
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

    const guides = await guide.find(filter).skip(skip).limit(limit);
    const total = await guide.countDocuments(filter);
    res.json({
      page: Number(page),
      limit:limit,
      total:total,
      nbPages: Math.ceil(total / limit),
      data: guides
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const guideFound = await guide.findById(req.params.id);
    if (!guideFound) {
      return res.status(404).json({ message: "Jeu non trouvé" });
    }
    res.json(guideFound);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
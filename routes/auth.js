import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../schema/user.js";

const router = express.Router();

//Création de compte
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Nom d’utilisateur déjà utilisé." });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id, role: newUser.role },"SECRET_KEY",{ expiresIn: "1h" });
    res.status(201).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

//Connexion
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Utilisateur non trouvé." });
  }
  const isValid = await bcrypt.compare(password,user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Mot de passe invalide." });
  }

  const token = jwt.sign({ id: user._id, role: user.role },"SECRET_KEY",{ expiresIn: "1h" });
  res.json({ token });
});

export default router;
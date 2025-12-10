import express from "express";
import User from "../models/User.js";
const router = express.Router();

router.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  res.json(user);
});

router.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

export default router;

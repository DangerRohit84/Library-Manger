import express from "express";
import Seat from "../models/Seat.js";
const router = express.Router();

router.get("/", async (req, res) => {
  res.json(await Seat.find());
});

router.put("/:id", async (req, res) => {
  await Seat.findByIdAndUpdate(req.params.id, req.body);
  res.send("Updated");
});

export default router;

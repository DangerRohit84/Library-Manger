import express from "express";
import Booking from "../models/Booking.js";
const router = express.Router();

router.get("/", async (req, res) => {
  res.json(await Booking.find());
});

router.post("/", async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.json(booking);
});

router.delete("/:id", async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

export default router;

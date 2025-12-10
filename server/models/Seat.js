import mongoose from "mongoose";

const SeatSchema = new mongoose.Schema({
  label: String,
  type: String,
  isMaintenance: Boolean,
  x: Number,
  y: Number,
  rotation: Number
});

export default mongoose.model("Seat", SeatSchema);

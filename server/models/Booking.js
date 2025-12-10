import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  seatId: String,
  userId: String,
  userName: String,
  date: String,
  startTime: String,
  endTime: String,
  status: String,
  timestamp: Number
});

export default mongoose.model("Booking", BookingSchema);

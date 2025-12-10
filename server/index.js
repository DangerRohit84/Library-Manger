import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import seatRoutes from "./routes/seats.js";
import bookingRoutes from "./routes/bookings.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error", err));

app.use("/api/auth", authRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/bookings", bookingRoutes);

app.listen(process.env.PORT, () =>
  console.log(`✅ Server running on ${process.env.PORT}`)
);

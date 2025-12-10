import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js";

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

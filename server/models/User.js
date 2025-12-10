import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  studentId: String,
  department: String,
  yearSection: String,
  mobile: String,
  role: String,
  isBlocked: Boolean
});

export default mongoose.model("User", UserSchema);

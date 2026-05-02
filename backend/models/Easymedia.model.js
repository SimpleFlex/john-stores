import mongoose from "mongoose";

const easyMediaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const EasyMedia =
  mongoose.models.EasyMedia || mongoose.model("EasyMedia", easyMediaSchema);
export default EasyMedia;

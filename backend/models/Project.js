import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    language: {
      type: String,
      default: "javascript",
    },
    code: {
      type: String,
      default: "// start code here\n",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);

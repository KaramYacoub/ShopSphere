import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model("Category", categorySchema);

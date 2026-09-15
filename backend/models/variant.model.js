import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    clothing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clothing",
      required: [true, "Clothing is required"],
    },

    color: {
      type: String,
      required: [true, "Color is required"],
      trim: true,
    },

    size: {
      type: String,
      required: [true, "Size is required"],
      trim: true,
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

variantSchema.index(
  { clothing: 1, color: 1, size: 1 },
  { unique: true }
);

const Variant = mongoose.model("Variant", variantSchema);

export default Variant;
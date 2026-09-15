import mongoose from "mongoose";

const clothingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Cloth name is required"],
      minLength: 1,
      maxLength: 100,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Cloth description is required"],
      minLength: 1,
      trim: true,
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["HOMME", "FEMME", "UNISEXE"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
      default: null,
      validate: {
        validator: function (value) {
          return value == null || value < this.price;
        },
        message: "Discount price must be lower than price",
      },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },

        publicId: {
          type: String,
          required: true,
        },
      },
    ],

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Clothing = mongoose.model("Clothing", clothingSchema);

export default Clothing;
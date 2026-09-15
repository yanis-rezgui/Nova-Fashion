import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Client first name is required"],
      minLength: 1,
      maxLength: 100,
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Client last name is required"],
      minLength: 1,
      maxLength: 100,
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      minLength: 1,
      maxLength: 150,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Invalid phone number"],
      trim: true,
    },

    wilaya: {
      type: String,
      required: [true, "Wilaya is required"],
      minLength: 3,
      trim: true,
    },

    items: [
      {
        clothing: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Clothing",
          required: [true, "Clothing is required"],
        },

        variant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Variant",
          required: [true, "Variant is required"],
        },

        name: {
          type: String,
          required: [true, "Product name is required"],
          trim: true,
        },

        size: {
          type: String,
          required: [true, "Size in order is required"],
          trim: true,
        },

        color: {
          type: String,
          required: [true, "Color in order is required"],
          trim: true,
        },

        price: {
          type: Number,
          required: [true, "Price in order is required"],
          min: 0,
        },

        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: 1,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: 0,
    },

    deliveryFee: {
      type: Number,
      required: [true, "Delivery fee is required"],
      min: 0,
    },

    status: {
      type: String,
      default: "EN_PREPARATION",
      enum: [
        "EN_PREPARATION",
        "EXPEDIEE",
        "LIVREE",
        "ANNULEE",
      ],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
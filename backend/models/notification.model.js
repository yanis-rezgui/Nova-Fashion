import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      maxLength: 150,
    },

    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
      maxLength: 500,
    },

    type: {
      type: String,
      required: [true, "Notification type is required"],
      enum: [
        "NEW_ORDER",
        "ORDER_CANCELLED",
        "ORDER_DELIVERED",
        "NEW_CATEGORY",
        "NEW_CLOTHING",
      ],
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Notifications non lues
notificationSchema.index({ read: 1, createdAt: -1 });

// Trier rapidement les notifications par date
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
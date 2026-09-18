import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
    {
        shopName: {
            type: String,
            required: true,
            trim: true
        },

        shipping: {
            algerPrice: {
                type: Number,
                required: true,
                min: 0
            },

            outsideAlgerPrice: {
                type: Number,
                required: true,
                min: 0
            }
        },

        contact: {
            phone: {
                type: String,
                required: true,
                trim: true
            },

            email: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            }
        },

         socialLinks: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        

        url: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    },
    {
        timestamps: true
    }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;